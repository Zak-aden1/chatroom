class Chatroom {
  constructor(room, username){
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }
  async addChat(message){
    // format chat object
    const now = new Date();
    const chat = {
      room: this.room,
      message,
      username: this.username,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    }
    // save chat document
    const response = await this.chats.add(chat)
    return response
  }
  getChats(callback){
    this.unsub = this.chats
    .where('room', '==', this.room)
    .orderBy('created_at')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          // change ui
          callback(change.doc.data())
        } 
      })
    })
  }
  updateName(name){
    this.username = name
  }
  updateRoom(room){
    this.room = room
    console.log('room updated');
    this.unsub ? this.unsub() : null
  }
}

const chatroom = new Chatroom('gaming', 'zak')

// chatroom.addChat('is this working')
// .then(() => console.log('chat added'))
// .catch(er => console.log(er))
chatroom.getChats((data) => {
  console.log(data);
})



setTimeout(() => {
  chatroom.updateRoom('gaming')
  chatroom.updateName('chicken')
  chatroom.getChats((data) => {
    console.log(data);
  })
  chatroom.addChat('hello')
}, 3000)