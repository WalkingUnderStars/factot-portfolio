// =============================
// task controller - logica pentru task-uri
// =============================

const { Task, User } = require('../models');
// Import modelele task si user cu relatii deja definite

// =============================
// 1. Creaza task nou
// =============================
// @desc Creaza un task nou
// @route POST / api/tasks
// @access privat trebuie logare

const createTask = async (req, res) => {
  try {
    // Extrag datele din request body ce trimite user-ul
    const { title, description, country, city, address, isRemote, budgetMin, budgetMax, currency, deadLine } = req.body;

    // Validare - verificam daca avem datel obligatorii
    if (!title || !description || !country) {
      return res.status(400).json({
        success: false,
        message: 'Te rog completeaza titlul, descrierea si tara'
      });
    }

    // Cream task-ul in baza de date
    const task = await Task.create({
      ...req.body,                // Taote datele din body
      clientId: req.user.id       // ID-ul utilizatorului lgoat vine din malware
    });

    // Raspuns success
    res.status(201).json({
      success: true,
      message: 'Task creat cu success!',
      data: { task }
    });
    
  } catch (error) {
    console.error('Eroare create task:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la crearea task-ului',
      error: error.message
    });
  }
};

// =====================================
// 2. Obtine toate taskurile cu filtre
// =====================================
// @desc obtin lista de task-uri cu filtre
// @route GET / api/ tasks
// @access public orcine poate vedea task-urile

const getTasks = async (req, res) => {
  try {
    // extrage filstrele din query params
    const { country, city, status = 'open', page = 1, limit = 20 } = req.query;

    // Construim obiectul de filtrare
    const where = { status }; // Status open

    if (country) where.country = country; // DAca e specificata tara 
    if (city) where.city = city;  // Daca este specificat orasul

    // paginare cate task-uri pe pagina
    const offset = (page - 1) * limit;

    // Interogare baza de date
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'firstName', 'lastName', 'rating'] // doar campurile astea
      }],
      limit: parseInt(limit),       // maxim
      offset: parseInt(offset),     // de unde sa inceapa
      order: [['createdAt', 'DESC']]     // cele mai noi primele
    });

    // Raspuns cu task-uri + info paginare
    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total: count,                       // total task-uri
          page: parseInt(page),               // pagina curenta
          pages: Math.ceil(count / limit)     // total pagini
        }
      }
    });
  } catch (error) {
    console.error('Eroare get tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la obtinerea tas-urilor'
    });
  }
};

// ===============================================
// 3. obtine un task specific
// ===============================================
// @desc obtine detaliile unui task
// @route get/ api / tasks/ :id
// @access public

const getTaskById = async (req, res) => {
  try {
    // Cauta task-ul dupa id din url/api/tasks/123
    const task = await Task.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'firstName', 'lastName', 'rating', 'city', 'country']
      }]
    });

    // verificare - exista task-ul
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task-ul nu a fost gasit'
      });
    }

    // Raspuns success
    res.json({
      success: true,
      data: { task }
    });

  } catch (error) {
    console.error('Error get task:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la obtinerea task-ului'
    });
  }
};

// ===========================================
// Actualizare task
// ===========================================
// @desc Actualizeaza un task existent
// @route put /api/tasks/:id
// @access private doar creatorul

const updateTask = async (req, res) => {
  try {
    // gasim task-ul
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task-ul nu a fost gasit'
      });
    }

    // Verificare - esti proprietar?
    // req.user.id = utilizator logat din middleware
    // task.clientId = proprietarul task-ului

    if (task.clientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Nu ai permisiunea sa modifici acest task'
      });
    }

    // Actualizam task-urile noi
    await task.update(req.body);

    // raspuns success
    res.json({
      success: true,
      message: 'Task actualizat cu success!',
      date: { task }
    });

  } catch (error) {
    console.error('Eroare update task:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la actualizarea task-ului'
    });
  }
};

// =================================================
// sterge task
// =================================================
// @desc sterge un task
// @route delete /api/task/:id
// @access private (doar proprietarul)

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task-ul nu a fost gasit'
      });
    }

    // stergem task-ul
    await task.destroy();

    // raspuns success
    res.json({
      success: true,
      message: 'Task sters cu success!'
    });

  } catch (error) {
    console.error('Eroare delete task:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la stergerea task-ului'
    });
  }
};

// ===========================
// Export toate functiile
// ===========================
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};