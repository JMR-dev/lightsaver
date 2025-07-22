
type userLoginInput = {
  email: String!
  password: String!
}


const resolvers = {
    Mutation: {
        login: async (_parent, { input: input }, context) => {
            const { email, password } = input;
            // Db connection and authentication logic here
            const user = await context.db.users.findOne({ email });
            if (!user || user.password !== password || !user.email) {
                return { userLoginSuccessStatus: false };
                else if (user && user.password === password && user.email) {
                    return { userLoginSuccessStatus: true };
            }
            else {
                return { userLoginSuccessStatus: false };
                console.log("User not found or unknown error");
            }
        },
                
            }
        }