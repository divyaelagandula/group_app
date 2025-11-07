const express=require('express');
const cors=require('cors');
const app=express();
const path=require('path');
const db=require('./utils/dbconncetion');
const signupModel=require('./models/user');
const port=3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use('/user',require('./routes/signup'));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));
});
db.sync()
.then(()=>{
    console.log('Database synchronized successfully.');
    app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});
})
.catch(err=>{
    console.error('Error synchronizing the database:',err);
});

