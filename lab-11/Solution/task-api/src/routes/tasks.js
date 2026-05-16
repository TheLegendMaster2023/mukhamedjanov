const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  validateCreateTask, 
  validateUpdateTask, 
  validateId 
} = require('../middleware/validation');
const { 
  initializeDataFile, 
  readData, 
  writeData, 
  getNextId 
} = require('../utils/fileOperations');

initializeDataFile();

router.get('/', async (req, res, next) => {
  try {
    const { category, completed, priority, sortBy, page, limit, q } = req.query;
    const data = await readData();
    let tasks = [...data.tasks];
    
    // Фильтрация по категории
    if (category) {
      tasks = tasks.filter(t => t.category === category);
    }
    
    // Фильтрация по статусу выполнения
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      tasks = tasks.filter(t => t.completed === isCompleted);
    }
    
    // Фильтрация по приоритету
    if (priority) {
      const p = parseInt(priority, 10);
      tasks = tasks.filter(t => t.priority === p);
    }

    // Текстовый поиск (как дополнительное задание C, перенесено сюда для удобства или как отдельный эндпоинт, здесь как фильтр)
    if (q && q.trim().length >= 2) {
      const searchTerm = q.toLowerCase().trim();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchTerm) || 
        t.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Сортировка
    if (sortBy) {
      const isDesc = sortBy.startsWith('-');
      const field = isDesc ? sortBy.slice(1) : sortBy;
      
      tasks.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        
        if (field === 'dueDate' || field === 'createdAt') {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        }
        
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }
    
    let result = tasks;
    
    // Пагинация
    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = pageNum * limitNum;
      result = tasks.slice(startIndex, endIndex);
    }
    
    res.json({
      success: true,
      count: result.length,
      total: tasks.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Дополнительно: отдельный роут для поиска
router.get('/search/text', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Поисковый запрос должен содержать минимум 2 символа'
      });
    }
    
    const data = await readData();
    const searchTerm = q.toLowerCase().trim();
    
    const results = data.tasks.filter(t => 
      t.title.toLowerCase().includes(searchTerm) || 
      (t.description && t.description.toLowerCase().includes(searchTerm))
    );
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
    
  } catch (error) {
    next(error);
  }
});

router.get('/stats/summary', async (req, res, next) => {
  try {
    const data = await readData();
    const tasks = data.tasks;
    
    const stats = {
      total: tasks.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      byCategory: {},
      byPriority: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      }
    };
    
    const now = new Date();
    
    tasks.forEach(t => {
      if (t.completed) {
        stats.completed++;
      } else {
        stats.pending++;
        if (t.dueDate && new Date(t.dueDate) < now) {
          stats.overdue++;
        }
      }
      
      stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + 1;
      
      if (t.priority >= 1 && t.priority <= 5) {
        stats.byPriority[t.priority]++;
      }
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const data = await readData();
    
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) {
      const err = new Error('Задача не найдена');
      err.status = 404;
      throw err;
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateCreateTask, async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;
    const data = await readData();
    
    const newTask = {
      id: await getNextId(),
      uuid: uuidv4(),
      title,
      description: description || '',
      category: category || 'personal',
      priority: priority || 3,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.tasks.push(newTask);
    await writeData(data);
    
    res.status(201).json({
      success: true,
      message: 'Задача успешно создана',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateId, validateUpdateTask, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    const data = await readData();
    
    const index = data.tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      const err = new Error('Задача не найдена');
      err.status = 404;
      throw err;
    }
    
    const updatedTask = {
      ...data.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    data.tasks[index] = updatedTask;
    await writeData(data);
    
    res.json({
      success: true,
      message: 'Задача успешно обновлена',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/complete', validateId, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const data = await readData();
    
    const index = data.tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      const err = new Error('Задача не найдена');
      err.status = 404;
      throw err;
    }
    
    data.tasks[index].completed = true;
    data.tasks[index].updatedAt = new Date().toISOString();
    
    await writeData(data);
    
    res.json({
      success: true,
      message: 'Задача отмечена как выполненная',
      data: data.tasks[index]
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const data = await readData();
    
    const index = data.tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      const err = new Error('Задача не найдена');
      err.status = 404;
      throw err;
    }
    
    data.tasks.splice(index, 1);
    await writeData(data);
    
    res.json({
      success: true,
      message: 'Задача успешно удалена'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
