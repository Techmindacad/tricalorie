// - Set a calorie limit
// - Add meals and workouts
// - Delete meals and workouts
// - Filter meals and workouts
// - Display total calories gain/loss
// - A progress bar to visualize total calories gain/loss
// - Display calories consumed and burned
// - Reset calories and clear meals and workouts
// - Use local storage to persist total calories, calorie limit, meals and workouts
// - Use Bootstrap for styling and UI components (Modal & Collapse)

class CalorieTracker {
    constructor(){
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = [];

        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
        addMeal(meal){
            this._meals.push(meal);
            this._totalCalories += meal.calories;
            this._displayNewMeal(meal)
            Storage.updateCalories(this._totalCalories);
            Storage.saveMeal(meal)
            this._render()
        }
        addWorkout(workout){
            this._workouts.push(workout);
            this._totalCalories -= workout.calories;
            Storage.updateCalories(this._totalCalories);
            this._render()
        }

        _displayCaloriesTotal(){
            const totalCaloriesEl = document.getElementById('calories-total');
            totalCaloriesEl.innerHTML = this._totalCalories;
        }

        _displayCaloriesLimit(){
            const calorieLimitEl = document.getElementById('calories-limit');
            calorieLimitEl.innerHTML = this._calorieLimit;
        }

        _displayCaloriesConsumed(){
            const caloriesConsumedEl = document.getElementById('calories-consumed');
            const consumed = this._meals.reduce((total, meal)=> total+meal.calories, 0);
            caloriesConsumedEl.innerHTML = consumed 
        }

        _displayCaloriesBurned(){
            const caloriesBurnedEl = document.getElementById('calories-burned');
            const burned = this._workouts.reduce((total, workout)=> total+workout.calories, 0);
            caloriesBurnedEl.innerHTML = burned 
        }

        _displayCaloriesRemaining(){
            const caloriesRemainingEl = document.getElementById('calories-remaining');
            const progressEl = document.getElementById('calorie-progress');
            const remaining = this._calorieLimit - this._totalCalories
            caloriesRemainingEl.innerHTML = remaining; 

            if (remaining<=0){
                caloriesRemainingEl.parentElement.classList.remove('bg-light');
                caloriesRemainingEl.parentElement.classList.add('bg-danger');
                progressEl.classList.add('bg-danger');
                progressEl.classList.remove('bg-success');
            } else{
                caloriesRemainingEl.parentElement.classList.remove('bg-danger');
                caloriesRemainingEl.parentElement.classList.add('bg-light');
                progressEl.classList.remove('bg-danger');
                progressEl.classList.add('bg-success');
            }
        }

        _render(){
            this._displayCaloriesTotal();
            this._displayCaloriesLimit();
            this._displayCaloriesConsumed();
            this._displayCaloriesBurned()
            this._displayCaloriesRemaining()
            this._displayCaloriesProgress()
        //    this._displayNewMeal(meal)
        }

        _displayCaloriesProgress(){
            const progressEl = document.getElementById('calorie-progress');
            const percentage = (this._totalCalories / this._calorieLimit) * 100;
            const width = Math.min(percentage, 100)
            progressEl.style.width = `${width}%`
        }

        _displayNewMeal(meal){
            const mealsEl = document.getElementById('meal-items');
            const mealEl = document.createElement('div');
            mealEl.classList.add('card', 'my-2');
            mealEl.setAttribute("data-id", meal.id);
            mealEl.innerHTML = `
            <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <h4 class="mx-1">${meal.name}</h4>
              <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                ${meal.calories}
              </div>
              <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
              </button>
          </div>
        </div>
            `;
            mealsEl.appendChild(mealEl);

        }

        removeMeal(id){
            const index = this._meals.findIndex((meal) => meal.id === id);
            if (index !== -1) {
                const meal = this._meals[index]
                this._meals.splice(index, 1)
                this._totalCalories -= meal.calories;
                Storage.updateCalories(this._totalCalories);
                Storage.removeMeal(id)
                this._render();
            }
        }

        reset(){
            this._totalCalories = 0;
            this._meals = [];
            this._workouts = [];
            Storage.clearAll();
            this._render()
        }

        setLimit(calorieLimit){
            this._calorieLimit = calorieLimit;
            Storage.setCalorieLimit(calorieLimit);
            this._displayCaloriesLimit()
            this._render()
        }

        loadItems(){
            this._meals.forEach((meal)=> this._displayNewMeal(meal));
        }

}

class Meal{
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}

class Workout{
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}

class Storage{
    static getCalorieLimit(defaultLimit = 2000){
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else{
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit){
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultCalories = 0){
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories;
        } else{
            totalCalories = +localStorage.getItem('totalCalories')
        }
        return totalCalories;
    }

    static updateCalories(calories){
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals(){
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals = [];
        } else{
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals
    }

    static saveMeal(meal){
        const meals = Storage.getMeals();
        meals.push(meal)
        localStorage.setItem('meals', JSON.stringify(meals))
    }

    static removeMeal(id){
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static clearAll(){
        // localStorage.removeItem('meals');
        // localStorage.removeItem('workouts');
        // localStorage.removeItem('totalCalories');

        localStorage.clear()
    }
}

class App{
    constructor(){
        this._tracker = new CalorieTracker();
        this._tracker.loadItems();

        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));


    }

    _newItem(type, e){
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        // create a new meal
        if (type === 'meal') {
             const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        }
        if (type === 'workout') {
            const workout = new Workout(name.value, +calories.value);
           this._tracker.addWorkout(workout);
       }
        //clear the form
        name.value = '';
        calories.value = '';

        //collapse the form
        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    }

    _removeItem(type, e){
        if (e.target.classList.contains("delete") || e.target.classList.contains("fa-xmark")) {
            const id = e.target.closest('.card').getAttribute('data-id')
            type === 'meal'? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

            const item = e.target.closest('.card')
            item.remove();
            
        }
    }

    _filterItems(type, e){
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) =>{
            const name = item.firstElementChild.firstElementChild.textContent;
            if (name.toLowerCase().indexOf(text) != -1) {
                item.style.display = 'block';
            } else{
                item.style.display = 'none';
            }          

        })
    }

    _reset(){
        if (confirm("Are u sure u squidworm")) {
            this._tracker.reset();
            document.getElementById('meal-items').innerHTML = '';
            document.getElementById('workout-items').innerHTML = '';
            document.getElementById('filter-meals').value = '';
            document.getElementById('filter-workouts').value = '';
        }
    }

    _setLimit(e){
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Bitte type a LIMIT')
            return
        }

        this._tracker.setLimit(+limit.value)
        limit.value = ''

        const modalEl = document.getElementById('limit-modal')
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide()
    }

}

const app = new App();


