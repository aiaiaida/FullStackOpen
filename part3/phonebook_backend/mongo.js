const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument, alternatively password name phonenumber')
    process.exit(1)
}

const [,,password,name,number] = process.argv

const url = `mongodb+srv://aadaappelsiini_db_user:${password}@cluster0.pynzlxg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
    name: name,
    number: number,
    })
    person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})}
else if (!name && !number) {

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}