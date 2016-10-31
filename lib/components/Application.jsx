import React, { Component } from 'react'
import firebase, { contactsFromDatabase, signIn, signOut } from '../firebase';
import {split, pick, map, extend } from 'lodash';
import moment from 'moment';
import NewContactForm from './NewContactForm.jsx';
import ContactCard from './ContactCard.jsx'
import ContactCardList from './ContactCardList.jsx';

// let contactsFromDatabase;

export default class Application extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      contacts: [],
      contactDatabase: null,
      contactImgStorage: null
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => this.setState({ user, contactDatabase: firebase.database().ref(user.uid), contactImgStorage: firebase.storage().ref() }, ()=>{

    firebase.database().ref(user.uid).on('value', (snapshot) => {
      const contacts = snapshot.val() || {};
      this.setState({
        contacts: map(contacts, (val, key) => extend(val, { key }))
        });
      });
    }
  ));
} //end of componentDidMount

  addNewContact(contact, image){
    this.state.contactDatabase.push(contact);
    this.state.contactImgStorage.child(`${this.state.user.uid}/${contact.contactID}.jpg`).put(image);
  }

  editContact(contactID, newContactInfo, image){
      this.state.contactDatabase.child(`${contactID}`).set(newContactInfo)
      this.state.contactImgStorage.child(`${this.state.user.uid}/${contact.contactID}.jpg`).put(image);
      console.log(contactID)
      // console.log(this.state.contacts);
  }

  render() {
    const { user } = this.state;
    if(this.state.contactImgStorage){
     console.log(this.state.contactImgStorage.bucket);
   }
    return(
      <div className = 'application'>

        <div className='active-user'>{user ?
          <p>Logged in as <span className="bold">{user.displayName}</span> ({user.email})  <button className='auth-button button' onClick={()=> signOut()}>Sign Out</button>
          </p>
        : <button className='auth-button' onClick={() => signIn()}>Sign In</button> }
        <button onClick={()=>this.addNewContact()}>Add Contact</button>
        </div>

        <ContactCardList user={this.state.user} imgStorage = {this.state.contactImgStorage} contacts = {this.state.contacts} submitEdit={this.editContact.bind(this)}/>
        <NewContactForm handleNewContact={this.addNewContact.bind(this)} numbers={{}} emails={{}} socialMedia={{}}/>
        <button onClick={this.editContact.bind(this)}>Test</button>
      </div>
    )
  }
}
