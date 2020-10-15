const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me:  async (parent, args, context) => {
      return await User.find({_id: context.user._id}).select('-__v -password');
    }
    
  },
  Mutation: {
    login:  async (parent, {email, password}) => {
      const user = await User.findOne({email: email})
      if(!user){
        throw new AuthenticationError("Incorrect login info")
        
      }
      const checkPassword = await user.isCorrectPassword(password) 
      if(!checkPassword){
        throw new AuthenticationError("Wrong password")

      }
      const token = signToken(user)
      const auth = {token, user}
      return auth
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user)
      const auth = {token, user}
      return auth;
      
    },
    saveBook:  async (parent, {BookInput}, context) => {
      if(context.user){
        const updateUserBook = await User.findByIdAndUpdate({
          _id: context.user._id
        },{$push:{savedBooks: BookInput}})
        return updateUserBook
      }else{
        throw new AuthenticationError("Must log into account.")

      }
       
    },
    removeBook:  async (parent, {bookId}, context) => {
      if(context.user){
        const removeUserBook = await User.findByIdAndUpdate({
          _id: context.user._id},{$pull:{savedBooks: bookId}
          }
        )
      }
    }
    
  }

};

module.exports = resolvers;
