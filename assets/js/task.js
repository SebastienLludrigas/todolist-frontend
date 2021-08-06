let task = {
    loadTasks: function(){
        // Tableau de configuration de notre requête AJAX
        let myInit = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };
          
        // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
        fetch( app.baseURI + 'tasks', myInit)
        // Ensuite, lorsqu'on reçoit la réponse au format JSON
        .then(function(response) {
            // On convertit cette réponse en un objet JS et on le retourne
            return response.json();
        })
        // Ce résultat au format JS est récupéré en argument ici-même
        .then(function(data) {
            //Je récupère mes tâches dans l'objet data et je les envoie à ma méthode qui va créer les selects
            task.createTasks(data);   
        });  
    },
    createTasks: function(tasks) {
        
        // On boucle sur toutes les tâches
        for(let i = 0; i < tasks.length; i++){
            
            // On récupère la tâche courante : 
            let currentTask = tasks[i];
            
            // On crée le HTML de cette tâche
            let taskName = currentTask.title;
            let taskCategoryId = currentTask.category_id;
            let status = currentTask.status;
            let completion = currentTask.completion;
            let id = currentTask.id;
            
            task.createTask(id, taskName, taskCategoryId, completion, status);
        }
    },
    createTask: function(id, taskNameValue, taskCategoryId, completion = 0, status = 1){
       
        // Récupération du template de tâche
        let template = document.querySelector('#task-template');
        // On crée une nouvelle tâche en clonant le template
        let newTask = template.content.cloneNode(true);


        // On applique des classes différentes selon le statut et la complétion de la tâche.
        // Si la tâche est terminée, on ajoute la classe task--complete
        if(completion == 100) {
            newTask.querySelector('.task').classList.add('task--complete');
        }

        // Si la tâche est archivée, on ajoute la classe task--archive
        if(status == 2){
            newTask.querySelector('.task').classList.add('task--archive');
        }

        // On remplit les différents éléments de notre copie
        newTask.querySelector('.task__name-display').textContent = taskNameValue;
        newTask.querySelector('.task__name-edit').setAttribute('value', taskNameValue);

        newTask.querySelector('.task__category p').textContent = category.categories[taskCategoryId];
        newTask.querySelector('.task').dataset.category = category.categories[taskCategoryId];
        newTask.querySelector('.task').dataset.id = id;
        
        // On appelle bindTaskEvents sur la tâche fraichement crée pour lui appliquer les différents écouteurs d'événéments.
        // Cette dernière étant créée après le chargement de la page, la boucle qui appliquait les écouteurs est déjà passée. Notre nouvelle tâche n'aura donc aucun écouteur par défaut
        app.bindTaskEvents(newTask);

        // On ajoute l'élément créé à la suite des autres éléments
        // @copyright Audrey
        document.querySelector('.tasks').appendChild(newTask);
    },
    // Méthode permettant d'envoyer une nouvelle tâche à l'API
    sendNewTask: function(taskName, categoryId){
        
        let taskData = {
            title:taskName,
            categoryId:categoryId,
            status:1,
            completion:0
        };

        // On prépare les entêtes HTTP (headers) de le requête
        // afin de spécifier que les données sont en JSON
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        // Préparation  des options de la requête AJAX
        let fetchOptions = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            // On ajoute les headers dans les options
            headers: myHeaders,
            // On ajoute les données, encodée en JSON, dans le corps de la requête
            body: JSON.stringify(taskData)
        };
        

        // Exécuter la requête HTTP via XHR
        fetch( app.baseURI + 'tasks', fetchOptions)
        .then(function(response) {
               return response.json();
            }
        ).then(function(newTask){
            // Création de la tâche dans le DOM d'après les informations reçues de l'API
           task.createTask(newTask.id, newTask.title, newTask.category_id);
        });

    },
    updateTitle: function(id, title, taskElement){
        // On stocke les données à transférer
        let taskData = {
            title: title,
        };

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Préparation  des options de la requête AJAX
        let fetchOptions = {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            // On ajoute les headers dans les options
            headers: myHeaders,
            // On ajoute les données, encodée en JSON, dans le corps de la requête
            body: JSON.stringify(taskData)
        };

        // Exécuter la requête HTTP via XHR
        fetch( app.baseURI + 'tasks/' + id, fetchOptions)
        .then(function(response) {
                return response.json();
            }
        ).then(function(newTask){

            // On récupère la balise P qui sert à afficher le nom de la tâche
            let displayName = taskElement.querySelector('.task__name-display');

            // On met à jour son contenu avec le nom de la tâche récupéré de notre API
            displayName.textContent = newTask.title;

            //On retire la classe 'task--edit' qui indique que l'élément était en cours d'édition.
            taskElement.classList.remove('task--edit');
        });
    },
    // Méthode permettant de mettre à jour la completion d'une tâche
    updateCompletion: function(id, completion, taskElement){
        // On stocke les données à transférer
        let data = {
            completion: completion
        };
        
        // On prépare les entêtes HTTP (headers) de le requête
        // afin de spécifier que les données sont en JSON
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        // Préparation  des options de la requête AJAX
        let fetchOptions = {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            // On ajoute les headers dans les options
            headers: myHeaders,
            // On ajoute les données, encodée en JSON, dans le corps de la requête
            body: JSON.stringify(data)
        };
        

        // Exécuter la requête HTTP via XHR
        fetch( app.baseURI + 'tasks/' + id, fetchOptions)
        .then(function(response) {
               return response.json();
            }
        ).then(function(task){
            // La méthode toggle permet d'ajouter une classe si elle n'est pas présente et de la retirer si elle est présente.
            taskElement.classList.toggle('task--complete');
        });

    },

    // Méthode permettant de mettre à jour la completion d'une tâche
    updateArchive: function(id, archive, taskElement){
        // On stocke les données à transférer
        let data = {
            archive
        };
        
        // On prépare les entêtes HTTP (headers) de le requête
        // afin de spécifier que les données sont en JSON
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        // Préparation  des options de la requête AJAX
        let fetchOptions = {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            // On ajoute les headers dans les options
            headers: myHeaders,
            // On ajoute les données, encodée en JSON, dans le corps de la requête
            body: JSON.stringify(data)
        };
        

        // Exécuter la requête HTTP via XHR
        fetch( app.baseURI + 'tasks/' + id, fetchOptions)
        .then(function(response) {
               return response.json();
            }
        ).then(function(task){
            // La méthode toggle permet d'ajouter une classe si elle n'est pas présente et de la retirer si elle est présente.
            taskElement.classList.toggle('task--archive');
        });

    },

        // Méthode permettant de supprimer une tâche
    delete: function(id, taskElement){
        // On stocke les données à transférer
        let data = {
            id
        };
        
        // On prépare les entêtes HTTP (headers) de le requête
        // afin de spécifier que les données sont en JSON
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        // Préparation  des options de la requête AJAX
        let fetchOptions = {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            // On ajoute les headers dans les options
            headers: myHeaders,
            // On ajoute les données, encodée en JSON, dans le corps de la requête
            body: JSON.stringify(data)
        };
        

        // Exécuter la requête HTTP via XHR
        fetch( app.baseURI + 'tasks/' + id, fetchOptions)
        .then(function(response) {
               return response.json();
            
        }).then(function(task) {
            console.log(task);
            taskElement.remove();
        });

    }
}