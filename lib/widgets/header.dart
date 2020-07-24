import 'package:flutter/material.dart';

AppBar header(context,
    {bool isAppTitle = false, String titleText, removeBackButton = false}) {
  return AppBar(
    automaticallyImplyLeading: removeBackButton ? false : true,
    title: Center(
      child: Text(
        isAppTitle ? 'FlutterShare' : titleText,
        style: TextStyle(
          color: Colors.white,
          fontFamily: isAppTitle ? 'Signatra' : '',
          fontSize: isAppTitle ? 50.0 : 22.0,
        ),
        overflow: TextOverflow.ellipsis,
      ),
    ),
    backgroundColor: Theme.of(context).accentColor,
  );
}
