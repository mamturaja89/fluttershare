//import 'dart:html';

import 'package:flutter/material.dart';
import 'package:fluttershare/models/user.dart';
import 'package:fluttershare/pages/home.dart';
import 'package:fluttershare/widgets/header.dart';
import 'package:fluttershare/widgets/post.dart';
import 'package:fluttershare/widgets/progress.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

final usersRef = Firestore.instance.collection('users');

class Timeline extends StatefulWidget {
  final User currentUser;

  Timeline({this.currentUser});
  @override
  _TimelineState createState() => _TimelineState();
}

class _TimelineState extends State<Timeline> {
  List<Post> posts;
  @override
  void initState() {
    //print(currentUser);
    super.initState();
    getTimeline();
  }

  getTimeline() async {
    QuerySnapshot snapshot = await timelineRef
        .document(widget.currentUser.id)
        //.document('104179260422430620154')
        .collection('timelinePosts')
        .orderBy('timeStamp', descending: true)
        .getDocuments();
    List<Post> posts =
        snapshot.documents.map((doc) => Post.fromDocument(doc)).toList();
    setState(() {
      this.posts = posts;
    });
  }
//  createUser() {
//    usersRef
//        .document("jjfjhfjshf")
//        .setData({"username": "rob", "postsCount": 0, "isAdmin": false});
//  }
//
//  updateUser() async {
//    final doc = await usersRef.document("AzA7LtzrTcpOOtxmIuWN").get();
//    if (doc.exists) {
//      doc.reference.updateData(
//          {"username": "robPercival", "postsCount": 0, "isAdmin": false});
//    }
//  }
//
//  deleteUser() async {
//    final doc = await usersRef.document("AzA7LtzrTcpOOtxmIuWN").get();
//    if (doc.exists) {
//      doc.reference.delete();
//    }
//  }

//  @override
//  Widget build(context) {
//    return Scaffold(
//      appBar: header(context, isAppTitle: true),
//      body: StreamBuilder<QuerySnapshot>(
//          stream: usersRef.snapshots(),
//          builder: (context, snapshot) {
//            if (!snapshot.hasData) {
//              return circularProgress();
//            }
//            final List<Text> children = snapshot.data.documents
//                .map((doc) => Text(doc['username']))
//                .toList();
//            return Container(
//              child: ListView(
//                children: children,
//              ),
//            );
//          }),
//    );
//  }
//}

  buildTimeline() {
    if (posts == null) {
      return circularProgress();
    } else if (posts.isEmpty) {
      return Text('No posts');
    } else {
      return ListView(
        children: posts,
      );
    }
  }

//

  @override
  Widget build(context) {
    return Scaffold(
      appBar: header(context, isAppTitle: true),
      body: RefreshIndicator(
        onRefresh: () => getTimeline(),
        child: buildTimeline(),
      ),
    );
  }
}
