function loginUserResolver() {
    return {
        Subscription: {
            loginUser: {
                subscribe: async ({ email, password }: { email: string; password: string; }, { pubsub }: { pubsub }: { EventEmitter }) => {
                    loginUser({ email, password });
                    return pubsub.asyncIterator('LOGIN_SUCCESS' || 'LOGIN_FAILURE');
                }
            }
        }
    };
}

function logoutUserResolver() {
    return {
        Subscription: {
            logoutUser: {
                subscribe: async ({ email }: { email: string }, { pubsub }: { pubsub }: { EventEmitter }) => {
                    logoutUser({ email });
                    return pubsub.asyncIterator('LOGOUT_SUCCESS' || 'LOGOUT_FAILURE');
                }
            }
        }
    };
}

function createUserResolver() {
    return {
        Mutation: {
            createUser: async ({ email, password }: { email: string; password: string; }) => {
                const user = await createUser({ email, password });
                return user ?  "USER_CREATED_SUCCESS" : "USER_CREATION_FAILED";
            }
        }
    };
}