// ========================================
// INDEX MODELE - Definim toate relatiile
// ========================================

// Importam conexiunea la DB
const { sequelize } = require('../config/database');

// Importam toate modelele
const User = require('./User');
const Task = require('./Task');
const Proposal = require('./Proposal');
const Review = require('./Review');

// ========================================
// DEFINIM RELATIILE INTRE MODELE
// ========================================

// Relatie User <-> Task
// Un User (client) poate crea multe Task-uri
User.hasMany(Task, {
  foreignKey: 'client_id',  // Coloana din tabelul tasks care face legatura
  as: 'clientTasks'          // Cum accesam: user.clientTasks
});

// Fiecare Task apartine unui User (client)
Task.belongsTo(User, {
  foreignKey: 'client_id',  // Aceeasi coloana
  as: 'client'               // Cum accesam: task.client
});

// Relatie User <-> Proposal
// Un user (freelancer) poate crea multe proposal-uri
User.hasMany(Proposal, {
  foreignKey: 'freelancer_id',          // Coloana din tabelul proposals
  as: 'myProposals'                     // Cum accesam: user.myProposals
});

// Fiecare proposal apartine unui freelancer (user)
Proposal.belongsTo(User, {
  foreignKey: 'freelancer_id',
  as: 'freelancer'                          // Cum accesam: proposal.freelancer
});

// Relatie Task <-> Proposal
// Un task poate primi multe proposal-uri ( multi freelanceri aplica)
Task.hasMany(Proposal, {
  foreignKey: 'task_id',                // Coloana din tabelul proposals
  as: 'proposals'                       // Cum accesam: task.proposals
});

// Fiecare Proposal apartine unui Task
Proposal.belongsTo(Task, {
  foreignKey: 'task_id',
  as: 'task'                                // Cum accesam: proposal.task
});

// ========================================
// relatie user <-> review
// ========================================

// Un user poate primit multe review-uri
User.hasMany(Review, {
  foreignKey: 'reviewee_id',
  as: 'reviewsReceived'            // cum accesam user.reviewsReceived
});

// Un user poate scrie multe review-uri
User.hasMany(Review, {
  foreignKey: 'reviewer_id',
  as: 'reviewsGiven'                    // Cum access user.reviewsGiven
});

// review apartine unui reviewee
Review.belongsTo(User, {
  foreignKey: 'reviewee_id',
  as: 'reviewee'                // Cum accessam task.reviwee
});

// ========================================
// relatie task <-> review
// ========================================

// Un task poate primi multe review-uri
Task.hasMany(Review, {
  foreignKey: 'task_id',
  as: 'reviews'                         // Cum accesam task.reviews
});

// review apartine unui task
Review.belongsTo(Task, {
  foreignKey: 'task_id',
  as: 'task'                                // cum accesam review.task
});



// ========================================
// EXPORTAM TOATE
// ========================================
module.exports = {
  sequelize,  // Conexiunea
  User,       // Modelul User
  Task,        // Modelul Task
  Proposal,    // Modelul Proposal
  Review        // Modelul Review
};