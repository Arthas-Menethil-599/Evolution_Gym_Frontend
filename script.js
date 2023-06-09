const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');

const signUpForm = document.getElementById('signupForm');
const signUpButton = document.getElementById('signupButton');

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault(); 


  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;


  const signInData = { email, password };

  try {

    const response = await fetch('http://localhost:5296/api/Accounts/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signInData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User signed in successfully:', result);
      window.location.href = 'index-login.html';
    } else {
      console.error('Sign-in failed');
    }
  } catch (error) {
    console.error('An error occurred during sign-in:', error);
  }
});

loginButton?.addEventListener('click', () => {
  loginForm.submit();
});


signUpForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstNameInput').value;
  const lastName = document.getElementById('lastNameInput').value;
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;

  const signUpData = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  };

  try {
    const response = await fetch('http://localhost:5296/api/Accounts/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User signed up successfully:', result);
      window.location.href = 'login.html';
    } else {
      console.error('Sign-up failed');
    }
  } catch (error) {
    console.error('An error occurred during sign-up:', error);
  }
});

signUpButton?.addEventListener('click', () => {
  signUpForm.submit();
});



function formatDateTime(activityDate, finishedAt) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(activityDate).toLocaleDateString(undefined, options);

  return `${date}`;
}

function formatHours(activityDate, finishedAt) {

  const startTime = new Date(finishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = finishedAt.slice(11, 16);

  return `${startTime} - ${endTime}`;
}


async function fetchAndDisplayActivities() {
  try {
    const response = await fetch('http://localhost:5296/api/Activities');
    const activities = await response.json();

    
    const activityList = document.getElementById('activityList');
    activities.forEach(activity => {
      const activityHeader = document.createElement('h2');
      activityHeader.textContent = activity.activityName;

      const activityItem = document.createElement('div');
      activityItem.classList.add('activity-item');
      activityItem.innerHTML = `
        <p class="activity-date">${formatDateTime(activity.activityDate, activity.finishedAt)}</p>
        <p class="activity-hours">${formatHours(activity.activityDate, activity.finishedAt)}</p>
        <p><strong>Trainer ID:</strong> ${activity.trainerId}</p>
      `;

      activityList.appendChild(activityHeader);
      activityList.appendChild(activityItem);
    });
  } catch (error) {
    console.error('An error occurred while fetching activities:', error);
  }
}

fetchAndDisplayActivities();


new Vue({
  el: "#app",
  data() {
    return {
      currentCardBackground: Math.floor(Math.random()* 25 + 1), // just for fun :D
      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
      minCardYear: new Date().getFullYear(),
      amexCardMask: "#### ###### #####",
      otherCardMask: "#### #### #### ####",
      cardNumberTemp: "",
      isCardFlipped: false,
      focusElementStyle: null,
      isInputFocused: false
    };
  },
  mounted() {
    this.cardNumberTemp = this.otherCardMask;
    document.getElementById("cardNumber").focus();
  },
  computed: {
    getCardType () {
      let number = this.cardNumber;
      let re = new RegExp("^4");
      if (number.match(re) != null) return "visa";

      re = new RegExp("^(34|37)");
      if (number.match(re) != null) return "amex";

      re = new RegExp("^5[1-5]");
      if (number.match(re) != null) return "mastercard";

      re = new RegExp("^6011");
      if (number.match(re) != null) return "discover";
      
      re = new RegExp('^9792')
      if (number.match(re) != null) return 'troy'

      return "visa"; // default type
    },
		generateCardNumberMask () {
			return this.getCardType === "amex" ? this.amexCardMask : this.otherCardMask;
    },
    minCardMonth () {
      if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1;
      return 1;
    }
  },
  watch: {
    cardYear () {
      if (this.cardMonth < this.minCardMonth) {
        this.cardMonth = "";
      }
    }
  },
  methods: {
    flipCard (status) {
      this.isCardFlipped = status;
    },
    focusInput (e) {
      this.isInputFocused = true;
      let targetRef = e.target.dataset.ref;
      let target = this.$refs[targetRef];
      this.focusElementStyle = {
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
      }
    },
    blurInput() {
      let vm = this;
      setTimeout(() => {
        if (!vm.isInputFocused) {
          vm.focusElementStyle = null;
        }
      }, 300);
      vm.isInputFocused = false;
    }
  }
});

function openModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}