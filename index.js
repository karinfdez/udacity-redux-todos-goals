

        function generateId () {
            return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
        }

        //Actions
        const ADD_TODO = 'ADD_TODO';
        const REMOVE_TODO = 'REMOVE_TODO';
        const TOGGLE_TODO = 'TOGGLE_TODO';
        const ADD_GOAL = 'ADD_GOAL';
        const REMOVE_GOAL = 'REMOVE_GOAL';

        function addTodoAction(todo) {
            return {
                type: ADD_TODO,
                todo
            }
        }

        function removeTodoAction(id) {
            return {
                type: REMOVE_TODO,
                id
            }
        }

        function toggleTodoAction(id) {
            return {
                type: TOGGLE_TODO,
                id
            }
        }

        function addGoalAction(goal) {
            return {
                type: ADD_GOAL,
                goal
            }
        }

        function removeGoalAction(id) {
            return {
                type: REMOVE_GOAL,
                id
            }
        }

        //Reducers
        function todos (state = [], action) {
            switch(action.type) {
                case ADD_TODO :
                    return state.concat([action.todo]);
                case REMOVE_TODO : 
                return state.filter(todo => {
                    return todo.id !== action.id;
                }) 
                case TOGGLE_TODO : 
                return state.map((todo) => todo.id !== action.id ? todo : 
                Object.assign({}, todo, { complete: !todo.complete }))
                default:
                return state; 
            }
        }

        function goals (state = [], action) {
            switch(action.type) {
                case ADD_GOAL :
                    return state.concat([action.goal]);
                case REMOVE_GOAL : 
                return state.filter(goal => {
                    return goal.id !== action.id;
                }) 
                default:
                return state; 
            }
        }

        function checker (store) {
            return function (next) {
                return function (action) {
                    if(
                        action.type === ADD_TODO &&
                        action.todo.name.toLowerCase().includes('bitcoin')
                    ) {
                        return alert(`Nope. That's a bad idea`);
                    }
        
                    if(
                        action.type === ADD_GOAL &&
                        action.goal.name.toLowerCase().includes('bitcoin')
                    ) {
                        return alert(`Nope. That's a bad idea`);
                    }
                    return next(action); //It is going to be either the next middleware if there is more
                    //than one or will be store.dispatch
                }
            }

        }

        const store = Redux.createStore(Redux.combineReducers({
            todos,
            goals,
        }), Redux.applyMiddleware(checker));
        
        store.subscribe(() => {
            const { goals, todos } = store.getState();
            document.querySelector('#goals').innerHTML = ''; //Resetting content inside ul everytime state changes
            document.querySelector('#todos').innerHTML = '';
            goals.forEach(goal => addElemToDOM(goal, '#goals', removeGoalAction, goal.id));
            todos.forEach(todo => addElemToDOM(todo, '#todos', removeTodoAction, todo.id));
        })

        function addTodo () {
            const input = document.querySelector('#todo');
            const name = input.value.trim();
            input.value = '';
            store.dispatch(addTodoAction({
                id: generateId(),
                name,
                complete: false
            }))
        }   

        function addGoal () {
            const input = document.querySelector('#goal');
            const name = input.value.trim();
            input.value = '';
            store.dispatch(addGoalAction({
                id: generateId(),
                name
            }))
        }

        document.querySelector('#todoBtn').addEventListener('click', addTodo);
        document.querySelector('#goalBtn').addEventListener('click', addGoal);

        function createRemoveBtn(onClick) {
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = 'X';
            removeBtn.addEventListener('click', onClick);
            return removeBtn;
        }

        function addElemToDOM (elem, selector, removeAction, elemId) {
            const node = document.createElement('li');
            const text = document.createTextNode(elem.name);
            const removeBtn = createRemoveBtn(() => {
                store.dispatch(removeAction(elemId))
            })
            node.appendChild(text);
            node.appendChild(removeBtn);
            elem.hasOwnProperty('complete') && !!elem.complete &&
            node.classList.add('text-lined');
            node.addEventListener('click', () => {
                store.dispatch(toggleTodoAction(elem.id))
            })
            document.querySelector(selector).appendChild(node);
        }
