require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const authRoutes = require('./routes/auth');
const superadminRoutes = require('./routes/superadmin'); 

const app=express()
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Sequelize connection setup
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
});
// User model
const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  
  app.use('/auth', authRoutes);
  app.use('/superadmin', superadminRoutes);


  // Test route
  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.post("/users",async (req,res)=>{
    try{
        const{firstName,lastName,email,password}= req.body;
        const newUser = await User.create({firstName,lastName,email,password});
        res.status(201).json(newUser);

    }catch(error){
        res.status(400).json({error : error.message});

    }
  });

  app.get("/users",async(req,res)=>{
    try{
        const users = await User.findAll();
        res.status(200).json(users);    

    }catch(error){
        res.status(400).json({error: error.message })

    }
  });

  app.get("/users/:id",async(req,res)=>{
    try{
        const user = await User.findByPk(req.params.id);
        if (user){
            res.status(201).json(user);
        }else{
            res.status(404).json({error: "user not found"})
        }
    
    }catch(error){
        res.status(400).json({error:error.message})
    }

  });

  app.put("/users/:id",async(req,res)=>{
    try{
        const[updated]= await User.update(req.body,{where:{
            id:req.params.id
        }})
        if(updated){
            const UpdatedUser = await User.findByPk(req.params.id);
            res.status(200).json(UpdatedUser);

        }else{
            res.status(404).json({error: "User not Updated"})
        }

    }catch(error){
        res.status(400).json({error:error.message})

    }
  });

  app.delete("/users/:id",async(req,res)=>{
    try{
        const deleted = await User.destroy({where:{id:req.params.id}});
        if(deleted){
            res.status(204).send();

        }else{
            res.status(404).json({error:"user not deleted"})
        }
        

    }catch(error){
        res.status(400).json({error:error.message})

    }
  })




app.listen(PORT,()=>{
    console.log(`server running is ${PORT}`)
})