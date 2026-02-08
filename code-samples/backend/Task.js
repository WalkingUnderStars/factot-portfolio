// Impot librariile necesare
const { DataTypes } = require('sequelize');
// DataTypes = tipuri de date (STRING, INTEGER, BOOLEAN, ETC.)

const { sequelize } = require('../config/database');
// sequelize = conexiunea la baza de date

// ================================
// Definim modelul task
// ================================
// Un Model = Cum arata un task in baza de date
// E ca un formular: ce informatii trebuie sa completeze cineva cand creeaza un task

const Task = sequelize.define(
  'Task',
  {
    // Task = numele modelului va crea tabelul tasks in DB

    //=================================
    // ID-ul task-ului unic pentru fiecare
    //=================================

    id: {
      type: DataTypes.UUID,
      // UUID = ID universal unic
      // DE ce tip UID? Pentru ca e indisponibil de gicit si ofarte sigur

      defaultValue: DataTypes.UUIDV4,
      // Se genereaza automat cand creezi task

      primaryKey: true,
      // Cheia primara - identificatorul unic al taskului
    },

    //========================================
    // Cine a creat task-ul clientul
    // =======================================
    clientId: {
      type: DataTypes.UUID,
      // ID-ul clientului care a creat task-ul

      allowNull: false,
      // Nu poate fi gol = obligatoriu
      // fiecare task trebuie sa aiba un creator

      field: 'client_id',
      // Numele coloanei in DB va fi "client_id"
      // Dar in JAvaScript folosim clientId camelCase
    },

    // ==============================================
    // Informatii despre Task
    // ==============================================
    title: {
      type: DataTypes.STRING(200),
      // Text scurt, maxim 200 caractere
      // Ex: "Reparatie robinet bucatarie"

      allowNull: false,
      // obligatoriu - task-ul trebuie sa aiba un titlu
    },

    description: {
      type: DataTypes.TEXT,
      // Text lung, fara limita de caractere

      allowNull: false,
      // Obligaoriu - trebuie sa descrii ce vrei
    },

    // ===================================
    // Unde se face task-ul locatie
    // ===================================

    country: {
      type: DataTypes.STRING(2),
      // 2 litere pentru tara RO sau MD

      allowNull: false,
      // Obligatoriu trebuie sa specifici tara

      validate: {
        isIn: [['RO', 'MD']],
        // Validate doar RO sau MD sunt permise
        // Daca cineva incearca sa puna US -> eroare
      },
    },

    city: {
      type: DataTypes.STRING(100),
      // Orasul ex Bucuresti, Chisinau
      // MAxim 100 caractere
      // Nu e obligatoriu (allowNull implicit = true)
    },

    address: {
      type: DataTypes.TEXT,
      // Adresa completa optional
    },

    isRemote: {
      type: DataTypes.BOOLEAN,
      //true/false - se paote face remote online?

      defaultValue: false,
      // implicit = false trebuie sa vii fizic

      field: 'is_remote',
      // In DB is_remote in JAvaSCript isRemote
    },

    //==================================
    // CAt costa buget
    // =================================

    budgetMin: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'budget_min',
    },

    budgetMAx: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'budget_max',
    },

    currency: {
      type: DataTypes.STRING(3),
      // 3 litere pentru moneda EUR, MDL, RON, USD

      defaultValue: 'MDL',

      validate: {
        isIn: [['MDL', 'RON', 'EUR', 'USD']],
      },
    },

    // ==================================
    // Starea TAsk-ului (statut)
    // ==================================

    status: {
      type: DataTypes.ENUM(
        'draft',
        'open',
        'assigned',
        'in_progress',
        'completed',
        'cancelled',
      ),

      // lsita fixata de valori posibile

      // draft - ciorna
      // open - deschis
      // assigned - atribuit
      // in_progress - in lucru
      // completed - finalizat
      // cancelled - anilat

      defaultValue: 'open',
    },

    // =======================================
    // pana cand - deadline
    // =======================================
    deadLine: {
      type: DataTypes.DATE,
      // Data si ora cand trebuie finalziat
      // Nu e obligatoriu, unele tascuri nu au deadline
    },
  },
  {
    // ========================================
    // OPȚIUNI TABEL
    // ========================================
    tableName: 'tasks',
    // Numele tabelului în PostgreSQL va fi "tasks"

    timestamps: true,
    // Adaugă automat 2 coloane:
    // - created_at = când a fost creat task-ul
    // - updated_at = când a fost modificat ultima dată

    underscored: true,
    // Folosește snake_case în DB (client_id)
    // În loc de camelCase (clientId)
  },
);

// ========================================
// EXPORTĂM MODELUL
// ========================================
module.exports = Task;
// Astfel putem folosi acest model în alte fișiere
// Ex: const Task = require('./models/Task');
