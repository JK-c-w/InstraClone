var express = require('express');
var router = express.Router();
var userM=  require('./users');
var postM=require('./post');
const upload =require("./multer")
const passport = require('passport');
const LocalStrategy=require("passport-local");
const users = require('./users');
passport.use(new LocalStrategy(userM.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { footer:false });
});
router.get('/signup', function(req, res, next) {
  res.render('signup', { footer :false});
});
router.get('/edit', function(req, res, next) {
  res.render('edit',{footer:false} );
});
router.get('/feed', async function(req, res, next) {
  const user= await userM.findOne({username:req.user.username})
  res.render('front', {user, footer:true });
});
router.get('/search', async function(req, res, next) {
  const user= await userM.findOne({username:req.user.username})
  res.render('search', {user, footer:true });
});
router.get('/upload', function(req, res, next) {
  res.render('upload', { footer:false });
});
router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user= await userM.findOne({username:req.user.username})
  .populate('uploads');
  res.render('Profile', {user,footer:true});
});
router.post('/post',isLoggedIn,upload.single("image"), async function(req, res, next) {
  const user= await userM.findOne({username:req.user.username});
  const up= await postM .create({
     image:req.file.filename,
     desc:req.body.desc,
     userid:user._id
  })
  user.uploads.push(up._id);
  await user.save();
  res.redirect('Profile');
});
 router.get('/error',function(req,res){
   res.send("wrong password or email");
 })
router.post('/register',function(req,res,next){
   const user = new userM ({
     username:req.body.username,
     email:req.body.email
   })
   userM.register(user,req.body.password)
   .then(function(Registerduser){
     passport.authenticate("local")(req,res,function(){
        res.redirect("/profile")
     })
   })
})

router.post('/fileupload',isLoggedIn,upload.single("dp"), async function(req, res, next) {
  const user= await userM.findOne({username:req.user.username});
 user.profileImage=req.file.filename;
  await user.save();
  res.redirect('/profile')
});
router.post('/edited',upload.single("dp"), async function(req, res, next) {
  const user= await userM.findOne({username:req.user.username});
 user.profileImage=req.file.filename;
 user.bio=req.body.bio;
 user.username=req.body.username;
 user.name=req.body.name;
  await user.save();
  res.redirect('/profile')
});
 router.post('/login',passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:'/error'
 }),function(req,res){})

router.post('/logout',function(req,res){
   req.logout(function(err){
     if(err){return next(err)}
     res.redirect('/')
   })
})
function isLoggedIn(req,res,next){
   if(req.isAuthenticated()) return next();
   else{
     console.log("error");
     res.redirect('/');
   }
}

module.exports = router;
