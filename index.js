

        function generateId () {
            return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
        }

        //Library Code
        function createStore(reducer) {
            
            let state;
            let listeners = [];

            
            const getState = () => state   //Returns the state

            const subscribe = (listener) => {   //Listens for change
                listeners.push(listener);
                return () => {
                    // listeners = listeners.filter((l) !== listener)
                }
            }

            const dispatch = (action) => {   //Updates the state inside the appStore
                state = reducer(state, action);
                listeners.forEach((listener) => listener());
            }
            
            return {
                getState,
                subscribe,
                dispatch
            }
        }

        //App Code
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

        function app(state = {}, action) {
            return {
                todos: todos(state.todos, action),
                goals: goals(state.goals, action)
            }
        }


        const store = createStore(app);
        store.subscribe(() => {
            const { goals, todos } = store.getState();
            document.querySelector('#goals').innerHTML = ''; //Resetting content inside ul everytime state changes
            document.querySelector('#todos').innerHTML = '';
            goals.forEach(goal => addElemToDOM(goal, '#goals'));
            todos.forEach(todo => addElemToDOM(todo, '#todos'));
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

        function addElemToDOM (elem, selector) {
            const node = document.createElement('li');
            const text = document.createTextNode(elem.name);
            node.appendChild(text);
            //Add the new element to the ul
            document.querySelector(selector).appendChild(node);
        }

        // store.dispatch(removeGoalAction(0))