

        function generateId () {
            return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
        }

        //Actions
        const ADD_TODO = 'ADD_TODO';
        const REMOVE_TODO = 'REMOVE_TODO';
        const TOGGLE_TODO = 'TOGGLE_TODO';
        const ADD_GOAL = 'ADD_GOAL';
        const REMOVE_GOAL = 'REMOVE_GOAL';
        const RECEIVE_DATA = 'RECEIVE_DATA';

        function addTodoAction(todo) {
            return {
                type: ADD_TODO,
                todo
            }
        }

        //Moving asyncrhonous call to API on an action
        //Then it is passed ReduThunk in the middleware
        function handleDeleteTodo(todo) { 
            return (dispatch) => {
                dispatch(removeTodoAction(todo.id));
                return API.deleteTodo(todo.id) //Removing todo from API
                .catch(() => {
                    dispatch(addTodoAction(todo))
                    alert('An error ocurred. Try again!');
                })
            }
        }

        function handleDeleteGoal(goal) {
            return (dispatch) => {
                dispatch(removeGoalAction(goal.id))
                return API.deleteGoal(goal.id) //Removing todo from API
                .catch(() => {
                    dispatch(addGoalAction(goal))
                    alert('An error ocurred. Try again!');
                })
            }
        }

        function handleInitialData () {
            return (dispatch) => {
                return  Promise.all([
                    API.fetchTodos(),
                    API.fetchGoals()
                ])
                .then(([todos, goals]) => {
                    dispatch(receiveDataAction(todos, goals))
                })
            }
        }

        function handleAddTodo(name, cb) {
            return(dispatch) => {
                return API.saveTodo(name)
                .then(todo => {
                    dispatch(addTodoAction(todo))
                    cb();
                }) 
                .catch(() => {
                    alert('There was an error. Try again!');
                })
            }
        }

        function handleToggleTodo(id) {
            return (dispatch) => {
                dispatch(toggleTodoAction(id))
        
                return API.saveTodoToggle(id)
                .catch(() => {
                    dispatch(toggleTodoAction(id));
                    alert('An error ocurred. Try again!');
                })
            }
        }

        function handleAddGoal (name, cb) {
            return (dispatch) => {
                return API.saveGoal(name)
                .then(goal => {
                    dispatch(addGoalAction(goal))
                    cb();
                })
                .catch(() => {
                    alert('There was an error. Try again!');
                })
            }
        }
        
        function removeTodoAction(id) {
            return {
                type: REMOVE_TODO,
                id
            }
        }

        function receiveDataAction(todos, goals) {
            return {
                type: RECEIVE_DATA,
                todos,
                goals
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
                case RECEIVE_DATA:
                    return action.todos
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
                case RECEIVE_DATA :
                    return action.goals;
                default:
                    return state; 
            }
        }

        function loading (state = true, action) {
            switch(action.type) {
                case RECEIVE_DATA :
                    return false;
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
            loading
        }), Redux.applyMiddleware(ReduxThunk.default, checker));
        
       