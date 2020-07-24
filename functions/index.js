//import 'package:cloud_firestore/cloud_firestore.dart';
const functions = require('firebase-functions');
const admin=require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.onCreateFollower=functions.firestore
.document("/followers/{userId}/userFollowers/{followerId}")
.onCreate(async (snap, context) => {
console.log("follower created",snap.data());
const userId=context.params.userId;
const followerId=context.params.followerId;


//1)Create followed users posts ref
const followedUserPostsRef=admin
.firestore()
.collection('posts')
.doc(userId)
.collection('userPosts');

//2)Create following users timeline ref
const timelinePostsRef=admin
.firestore()
.collection('timeline')
.doc(userId)
.collection('timelinePosts');

 //3)Get followed users post
const querySnapshot=await followedUserPostsRef.get();

//4)Add each users post to following users timeline
querySnapshot.forEach(doc =>{
if(doc.exists){
  const postId=doc.id;
  const postData=doc.data();
  timelinePostsRef.doc(postId).set(postData);
}
 })
});

exports.onDeleteFollower = functions.firestore
      .document("/followers/{userId}/userFollowers/{followerId}")
      .onDelete(async(snap, context) => {
        console.log("Follower deleted",snap.id);

const userId=context.params.userId;
const followerId=context.params.followerId;

const timelinePostsRef=admin
.firestore()
.collection('timeline')
.doc(userId)
.collection('timelinePosts')
.where('ownerId','==',userId);

const querySnapshot=await timelinePostsRef.get();
querySnapshot.forEach(doc =>{
if(doc.exists){
   doc.ref.delete();
   }
});
});


exports.onCreatePost=functions.firestore
.document('/posts/{userId}/userPosts/{postId}')
.onCreate(async (snap, context) => {

const postCreated=snap.data();
const userId=context.params.userId;
const postId=context.params.postId;

//get all the followers of the user who made the post
 const userFollowersRef=admin.firestore()
 .collection('followers')
 .doc(userId)
 .collection('userFollowers');

 const querySnapshot=await userFollowersRef.get();
 //add new post to each followers timeline
 querySnapshot.forEach(doc =>{
 const followerId=doc.id;

 admin
 .firestore()
 .collection('timeline')
 .doc(followerId)
 .collection('timelinePosts')
 .doc(postId)
 .set(postCreated);

 });
 });

exports.onUpdatePost = functions.firestore
    .document('/posts/{userId}/userPosts/{postId}')
    .onUpdate(async(change, context) => {

    const postUpdated=change.after.data();
    const userId=context.params.userId;
    const postId=context.params.postId;

const userFollowersRef=admin.firestore()
 .collection('followers')
 .doc(userId)
 .collection('userFollowers');

const querySnapshot=await userFollowersRef.get();
querySnapshot.forEach(doc =>{

const followerId=doc.id;
admin
 .firestore()
 .collection('timeline')
 .doc(followerId)
 .collection('timelinePosts')
 .doc(postId)
 .get().then(doc => {
 if(doc.exists){
 doc.ref.update(postUpdated);
 }
 });
});
});

exports.onDeletePost=functions.firestore
.document('/posts/{userId}/userPosts/{postId}')
.onDelete(async (snap, context) => {
     const userId=context.params.userId;
     const postId=context.params.postId;

 const userFollowersRef=admin.firestore()
  .collection('followers')
  .doc(userId)
  .collection('userFollowers');

 const querySnapshot=await userFollowersRef.get();
 querySnapshot.forEach(doc =>{

 const followerId=doc.id;
 admin
  .firestore()
  .collection('timeline')
  .doc(followerId)
  .collection('timelinePosts')
  .doc(postId)
  .get().then(doc => {
  if(doc.exists){
  doc.ref.delete();
  }
  });
 });
 });

