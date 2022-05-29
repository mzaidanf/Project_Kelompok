const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'fatwa',
            email: 'fatwa@gmail.com',
            password: '12345678'
        }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'fatwa',
            email: 'fatwa@gmail.com'
        },
        token: user.tokens[0].token

    })
    expect(user.password).not.toBe('12345678')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    const user = await User.findById(userOneId)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: 'password'
        }).expect(400)


})

test('Should get profile for user for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

})
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'fatwa',

        })
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user.name).toEqual('fatwa')

})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'blitar',
        })
        .expect(400)
})

test('Should not delete user if unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send()
        .expect(401)
})
test('Should not signup user with invalid name/email/password', async () => {
    await request(app)
        .post('/users')
        .send({
            name: '',
            email: '',
            password: '12345678'
        })
        .expect(400)
})
test('Should not update user with invalid name/email/password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: '',
            email: '',
            password: '12345678'
        })
        .expect(400)
})
