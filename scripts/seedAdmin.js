require('dotenv').config(); const mongoose = require('mongoose'); const bcrypt = require('bcrypt'); const User = require('../models/User');
async function seed(){ if(!process.env.MONGODB_URI){ console.error('MONGODB_URI not set'); process.exit(1); } await mongoose.connect(process.env.MONGODB_URI);
 const email = process.env.ADMIN_EMAIL || 'admin@c3.local'; const pass = process.env.ADMIN_PASS || 'Admin123'; const hash = await bcrypt.hash(pass,10);
 const exists = await User.findOne({email}); if(exists){ console.log('Admin exists'); process.exit(0); } await User.create({name:'Admin',email,password:hash,role:'admin'}); console.log('Admin created',email); process.exit(0); }
seed().catch(e=>{console.error(e);process.exit(1)});
