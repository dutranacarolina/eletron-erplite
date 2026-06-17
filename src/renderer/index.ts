import './index.css';

const form = document.querySelector<HTMLFormElement>('#login-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const authResponse = await window.api.login(email, password);
      console.log('Login successful:', authResponse);
    } catch (error) {
      console.error('Login failed:', error);
    }
  });
}
