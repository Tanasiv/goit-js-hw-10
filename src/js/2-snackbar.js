import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delayValue = Number(form.elements.delay.value);
  const selectedState = form.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedState === 'fulfilled') {
        resolve(delayValue);
        return;
      }

      reject(delayValue);
    }, delayValue);
  });

  promise
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  form.reset();
});