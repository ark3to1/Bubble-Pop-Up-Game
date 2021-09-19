// firebase start
const firebaseConfig = {
    apiKey: "AIzaSyBdh3d9IeYGt-qSbmBVrXxIflrmm7EKLzo",
    authDomain: "bubble-pop-up-game.firebaseapp.com",
    projectId: "bubble-pop-up-game",
    storageBucket: "bubble-pop-up-game.appspot.com",
    messagingSenderId: "11573904793",
    appId: "1:11573904793:web:93d77926e6a7036633ff08",
    measurementId: "G-Y280X9SE17"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}

function logout() {
    auth.signOut();
}


function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);
    auth.createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}


auth.onAuthStateChanged((user) => {
    if (user) {
        firestore.collection('users').doc(user.uid).set({
            email: user.email,
            lastLoggedInAt: new Date()
        })
            .then(() => {
                console.log("Document written");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        setData(user);
        setMessages();
        document.getElementById("user").innerHTML = user.email;
        document.getElementById("login_box").style.display = "none";
        document.getElementById("welcome_box").style.display = "block";
    } else {
        document.getElementById("login_box").style.display = "block";
        document.getElementById("welcome_box").style.display = "none";
    }
});

const setData = (user) => {
    firestore.collection('users').doc(user.uid).get().then((querySnapshot) => {
        const data = querySnapshot.data();
        const lastLoggedInAt = data.lastLoggedInAt;
        const lastLoggedInSpan = document.getElementById("lastLoggedIn");
        lastLoggedInSpan.innerHTML = lastLoggedInAt;
    });
}

const setMessages = () => {
    const messagesRef = firestore.collection('messages');
    messagesRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                createElementsForMessage(change.doc.data());
            }
        });
    });
};

const sendMessage = () => {
    const user = auth.currentUser.email;
    const message = document.getElementById("message").value;
    firestore.collection('messages').add({
        user, message, time: Date.now()
    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
};

const createElementsForMessage = (childData) => {
    const messagesDiv = document.getElementById("messages");
    const childDiv = document.createElement('div');
    childDiv.classList.add("single-message-body");
    const messageTextDiv = document.createElement('div');
    messageTextDiv.classList.add("message-text");
    const senderDiv = document.createElement('div');
    senderDiv.classList.add("message-sender");
    messageTextDiv.innerHTML = childData.message;
    const userEmail = auth.currentUser.email;
    if (childData.user === userEmail) {
        senderDiv.innerHTML = "You";
        childDiv.classList.add("sender");
    } else {
        senderDiv.innerHTML = childData.user;
        childDiv.classList.add("reciever");
    }
    childDiv.appendChild(senderDiv);
    childDiv.appendChild(messageTextDiv);
    messagesDiv.appendChild(childDiv);
};
// firebase end


let popped = 0;
let lifeline = 5;
document.addEventListener('mouseover', function(e){
    
    if (e.target.className === "balloon"){
        
                e.target.style.backgroundColor = "#ededed";
                e.target.textContent = "POP!";
                popped++;
                removeEvent(e);
                checkAllPopped();
                let score = document.getElementById('score');
                score.innerHTML="score " + popped;
                console.log(popped);
            
            }   
            
        });
        
        // let gallery = document.getElementById('#balloon-gallery').style.color;
        let gallery = document.getElementsByTagName('div').style.backgroundColor;

                
        console.log(gallery);

function removeEvent(e){
    e.target.removeEventListener('mouseover', function(){
        
    })
};

function checkAllPopped(){
    if (popped === 24){
        console.log('all popped!');
        let gallery = document.querySelector('#balloon-gallery');
        let message = document.querySelector('#yay-no-balloons');
        gallery.innerHTML = '';
        message.style.display = 'block';
    }
};