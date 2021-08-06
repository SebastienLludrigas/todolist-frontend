let category = {
    categories: {},
    loadCategories: function(){
        // Tableau de configuration de notre requête AJAX
        let myInit = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };
        
        // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
        // fetch('https://benoclock.github.io/S07-todolist/categories.json', myInit)
        fetch(app.baseURI + 'categories', myInit)
        // Ensuite, lorsqu'on reçoit la réponse au format JSON
        .then(function(response) {
            // On convertit cette réponse en un objet JS et on le retourne
            return response.json();
        })
        // Ce résultat au format JS est récupéré en argument ici-même
        .then(function(data) {
            // Méthode permettant de peupler la propriété listant les catégories
            category.setCategories(data);
            //Je récupère mes catégories dans l'objet data et je les envoie à ma méthode qui va créer les selects
            category.createCategoriesSelect(data);   
        })
        .then(task.loadTasks);
    },
    createCategoriesSelect: function(categories) {
        // Je récupère l'ensemble des containers qui vont accueillir mes select de catégories
        let selectContainers = document.querySelectorAll('.select');

        // On boucle sur chaque container pour y effectuer les mêmes opérations
        for (let i = 0; i < selectContainers.length; i++) {
            let currentContainer = selectContainers[i];

            // Création du select
            let select = document.createElement('select');

            // Si on est sur le premier select, on ajoute la classe filters__choice
            if( i == 0){
                select.classList.add('filters__choice');
            }

            // Création de l'option par défaut
            let defaultOption = document.createElement('option');
            // Ajout de l'attribut disabled pour désactiver la possibilité de sélectioner cette option
            defaultOption.setAttribute('disabled', "");
            defaultOption.setAttribute('selected', "");
            defaultOption.setAttribute('value', 0);
            // On donne un texte différent à l'option par défaut selon si elle est dans le header ou pas.
            if(i == 0) {
                defaultOption.textContent = 'Toutes les catégories';
            } else {
                defaultOption.textContent = 'Choisir une catégorie';
            }

            // On ajoute l'option par défaut au select
            select.appendChild(defaultOption);
            
            // On ajoute les options liées aux catégories
            for (let j = 0; j < categories.length; j++){
                let currentCategory = categories[j];

                // On crée une option par catégorie
                let option = document.createElement('option');
                option.textContent = currentCategory.name;
                option.setAttribute('value', currentCategory.id);

                // On ajoute l'option au select
                select.appendChild(option);
                
            }

            // On ajoute le select dans son container
            currentContainer.appendChild(select);

        }
        
    },
    setCategories: function(categories) {
        for (i = 0; i < categories.length; i++){
            let currentCategory = categories[i];
            // On ajoute une entrée dans category.categories avec un clé l'id et le nom en valeur
            category.categories[currentCategory.id] = currentCategory.name;
        }
        
    }
}