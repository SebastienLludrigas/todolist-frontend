let app = {
  allTasks: document.querySelector(".all-tasks"),
  completeTasks: document.querySelector(".complete-tasks"),
  incompleteTasks: document.querySelector(".incomplete-tasks"),
  archiveLink: document.querySelector(".archive"),

  init: function () {
    category.loadCategories();
    app.listenTasksEvents();
    app.formEvents();
    app.filterButtonEvent();
    app.archiveLinkEvent();
  },

  baseURI: "http://localhost:8000/",

  // Méthode venant appliquer les écouteurs d'événements sur les boutons de filtrage
  filterButtonEvent: function() {
    // Mise en place des écouteurs d'événements
    app.allTasks.addEventListener('click', app.handleFilterButtons);
    app.completeTasks.addEventListener('click', app.handleFilterButtons);
    app.incompleteTasks.addEventListener('click', app.handleFilterButtons);
  },

  archiveLinkEvent: function() {
    app.archiveLink.addEventListener('click', task.updateClassTasks);
  },

  handleFilterButtons: function(event) {
    // console.log(event.currentTarget.classList);
    let tasks = document.querySelectorAll('.task');

    // Si on a cliqué sur le bouton Toutes
    if (event.currentTarget.classList.contains("all-tasks")) {

      tasks.forEach(function(item) {
        if (!item.classList.contains('task--archive')) {
          item.classList.remove('hidden-task');
        }
      });

      app.completeTasks.classList.remove("is-selected", "is-info");
      app.incompleteTasks.classList.remove("is-selected", "is-info");
      app.allTasks.classList.add("is-selected", "is-info");

    } else if (event.currentTarget.classList.contains("complete-tasks")) {

      tasks.forEach(function(item) {
        if (!item.classList.contains('task--archive')) {
          item.classList.remove('hidden-task');
        }
        
        if (!item.classList.contains('task--complete')) {
          item.classList.add('hidden-task');
        }
      });

      app.allTasks.classList.remove("is-selected", "is-info");
      app.incompleteTasks.classList.remove("is-selected", "is-info");
      app.completeTasks.classList.add("is-selected", "is-info");

    } else {

      tasks.forEach(function(item) {
        if (!item.classList.contains('task--archive')) {
          item.classList.remove('hidden-task');
        }

        if (item.classList.contains('task--complete')) {
          item.classList.add('hidden-task');
        }
      });

      app.allTasks.classList.remove("is-selected", "is-info");
      app.completeTasks.classList.remove("is-selected", "is-info");
      app.incompleteTasks.classList.add("is-selected", "is-info");

    }
  },

  // Méthode venant appliquer les écouteurs d'événements à notre formulaire
  formEvents: function () {
    // On cible notre formulaire
    let form = document.querySelector(".task--add form");

    // J'écoute les événements submit sur mon formulaire
    form.addEventListener("submit", app.handleAddTaskFormSubmit);
  },

  handleAddTaskFormSubmit: function (event) {
    // On empêche le comportement par défaut du navigateur (ici recharger la page)
    event.preventDefault();
    // Récupération des valeurs du formulaire
    let taskNameValue = document.querySelector(".task--add input").value;
    let taskCategoryValue = document.querySelector(".task--add select").value;

    let errorElement = document.querySelector(".errorMessage");

    // Si l'utilisateur n'a pas choisi de catégorie
    if (taskCategoryValue === "0") {
      // On fait apparaître le message d'erreur
      errorElement.classList.add("show");
      // Sinon on envoi le formulaire
    } else {
      // J'appelle la méthode chargée d'envoyer la nouvelle tâche à notre API.
      task.sendNewTask(taskNameValue, taskCategoryValue);
      // On réinitialise la valeur de l'input
      document.querySelector(".task--add input").value = "";
      // On affiche l'option qui a la valeur 0 et qui correspond à "Choisir une catégorie"
      document.querySelector(".task--add select").value = 0;

      // On supprime la classe "show" au cas où elle aurait été ajoutée
      errorElement.classList.remove("show");
    }
  },

  // Méthode permettant d'écouter les événements sur toutes les tâches
  listenTasksEvents: function () {
    // On sélectionne toutes les tâches éditables
    let tasks = document.querySelectorAll(".task--editable");

    // On boucle sur sur la liste des tâches pour venir écouteur les événements sur chacune d'entre elles.
    for (let i = 0; i < tasks.length; i++) {
      // Récupération de la tâche courante de la boucle
      let currentTask = tasks[i];
      // On appelle la méthode bindTaskEvents qui va appliquer les différents écouteur d'événements sur la tâche.
      app.bindTaskEvents(currentTask);
    }
  },

  // Méthode permettant d'appliquer des écouteurs d'événements sur une tâche passée en arguments.
  bindTaskEvents: function (task) {
    // On cible le titre de la tâche
    let taskTitle = task.querySelector(".task__name p");

    // On cible l'input
    let taskInputTitle = task.querySelector(".task__name .input");

    // On cible aussi le bouton jaune
    let taskEditButton = task.querySelector(".task__button--modify");

    // On pose l'écouteur d'événement clic sur le titre, sur le bouton d'édition et sur l'input qui
    // apparaît lorsque l'on clicke sur le titre
    taskTitle.addEventListener("click", app.handleClickOnTaskTitle);
    taskInputTitle.addEventListener("click", app.handleClickOnTaskTitle);
    taskEditButton.addEventListener("click", app.handleClickOnTaskTitle);

    // On récupère l'input de la tâche
    let taskInput = task.querySelector(".task__name > input");

    // On pose l'écouteur d'événement sur la touche entrée
    taskInput.addEventListener("keydown", app.handleTaskTitle);

    // On cible le bouton de validation
    let taskButtonValidate = task.querySelector(".task__button--validate");
    let taskButtonIncomplete = task.querySelector(".task__button--incomplete");

    // On pose un écouteur de clic sur le bouton "terminer la tâche"
    taskButtonValidate.addEventListener("click", app.handleCompleteButtonClick);
    taskButtonIncomplete.addEventListener(
      "click",
      app.handleCompleteButtonClick
    );

    // On cible le bouton d'archivation et de désarchivation
    let taskButtonArchive = task.querySelector(".task__button--archive");
    let taskButtonDesarchive = task.querySelector(".task__button--desarchive");

    // On pose un écouteur de clic sur le bouton d'archivation et désarchivation
    taskButtonArchive.addEventListener("click", app.handleArchiveButtonClick);
    taskButtonDesarchive.addEventListener("click", app.handleArchiveButtonClick);

    // On cible le bouton de suppression
    let taskButtonDelete = task.querySelector(".task__button--delete");

    // On pose un écouteur de clic sur le bouton delete
    taskButtonDelete.addEventListener("click", app.handleDeleteButtonClick);
  },

  // Méthode permettant de cocher/décocher une tâche
  handleCompleteButtonClick: function (event) {
    // On sélectionne l'élément sur lequel on cliqué
    let clickedElement = event.currentTarget;

    // Récupération de la tâche parente
    let taskElement = clickedElement.closest(".task");

    // On récupère l'ID de la tâche concernée
    let taskId = taskElement.dataset.id;

    // On définit la valeur de completion d'après la classe de notre tâche :
    // Si elle a la classe `task--complete` c'est qu'elle déjà faite, on veut donc passer completion à 0. On passe completion à 100 dans le cas contraire.
    let completionValue = 100;

    if (taskElement.classList.contains("task--complete")) {
      completionValue = 0;
    }

    // On exécute la méthode qui va se charger de l'appel AJAX à notre API
    task.updateCompletion(taskId, completionValue, taskElement);
  },

  handleClickOnTaskTitle: function (event) {
    // On sélectionne l'élément sur lequel on cliqué
    let clickedElement = event.currentTarget;

    // Grâce à la fonction closest, on peut récupérer la tâche parente de cet élément
    // https://developer.mozilla.org/fr/docs/Web/API/Element/closest
    let taskElement = clickedElement.closest(".task");

    taskElement.classList.toggle("task--edit");
  },

  handleTaskTitle: function (event) {
    if (event.code === "Enter") {
      // Récupération de l'input qui a déclenché l'événement
      let inputElement = event.currentTarget;

      // On récupère le parent
      let taskElement = inputElement.closest(".task");
      let taskId = taskElement.dataset.id;

      let title = inputElement.value;

      task.updateTitle(taskId, title, taskElement);
    }
  },

  handleArchiveButtonClick: (event) => {
    // On sélectionne l'élément sur lequel on cliqué
    let clickedElement = event.currentTarget;
    // Récupération de la tâche parente
    let taskElement = clickedElement.closest(".task");
    // On récupère l'ID de la tâche concernée
    let taskId = taskElement.dataset.id;

    let archiveValue = 2;

    if (taskElement.classList.contains("task--archive")) {
      archiveValue = 1;
    }

    // On exécute la méthode qui va se charger de l'appel AJAX à notre API
    task.updateArchive(taskId, archiveValue, taskElement);
  },

  handleDeleteButtonClick: (event) => {
    // On sélectionne l'élément sur lequel on cliqué
    let clickedElement = event.currentTarget;
    // Récupération de la tâche parente
    let taskElement = clickedElement.closest(".task");
    // On récupère l'ID de la tâche concernée
    let taskId = taskElement.dataset.id;

    const deleteIsConfirm = confirm(
      "Êtes-vous sûr de vouloir supprimer cette tâche ?"
    );

    if (deleteIsConfirm) {
      // On exécute la méthode qui va se charger de l'appel AJAX à notre API
      task.delete(taskId, taskElement);
    }
  },
};

document.addEventListener("DOMContentLoaded", app.init);
