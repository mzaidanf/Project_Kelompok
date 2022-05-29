const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/model/user')
const Task = require('../../src/model/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'test user',
    email: 'test@gmail.com',
    password: 'test123test',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'Arslan',
    email: 'Arslan@gmail.com',
    password: 'Arslan123Arslan',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.SECRET)
    }]
}
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    author: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    author: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    author: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}