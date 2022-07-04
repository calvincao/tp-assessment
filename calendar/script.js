const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
let curDate = new Date();
const handleSelectDate = (e) => {
  // dates prior to 90 days are not clickable
  const clickedYear = curDate.getFullYear();
  const clickedMonth = curDate.getMonth();
  const clickedDate = e.target.innerText;
  const nintyDaysAgo = new Date().setDate(new Date().getDate() - 90);
  if (new Date(clickedYear, clickedMonth, clickedDate) < nintyDaysAgo) return;
  document.querySelector('.modal-text').innerText = `${months[clickedMonth]} ${clickedDate}, ${clickedYear}`;
  document.querySelector('.modal').classList.toggle('active');
  document.querySelector('#modal-overlay').classList.toggle('active');
};
const renderCalendar = () => {
  // on each render, all children divs (if it exist) & remove associated event listeners to save memory
  while (document.querySelector('.dates').lastChild) {
    document.querySelector('.dates').lastChild.removeEventListener('click', handleSelectDate);
    document.querySelector('.dates').lastChild.remove();
  }
  const daysInMonth = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0).getDate();
  const dayOfFirstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1).getDay();
  document.querySelector('.cur-month').innerText = `${months[curDate.getMonth()]} ${curDate.getFullYear()}`;
  // create & append empty divs until 1st date of month moves to correct weekday
  for (let i = 0; i < dayOfFirstDate; i++) {
    const div = document.createElement('div');
    div.classList.add('prev-date');
    document.querySelector('.dates').append(div);
  }
  // create a new date div for each date in current month and tag current day with class 'today' & add eventlistener to handle click
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement('div');
    if (i === curDate.getDate() && curDate.getMonth() === new Date().getMonth()) div.classList.add('today');
    div.innerText = i;
    div.addEventListener('click', handleSelectDate);
    document.querySelector('.dates').append(div);
  }
};
renderCalendar();
document.querySelector('.next').addEventListener('click', () => {
  curDate.setMonth(curDate.getMonth() + 1);
  renderCalendar();
});
document.querySelector('.prev').addEventListener('click', () => {
  curDate.setMonth(curDate.getMonth() - 1);
  renderCalendar();
});
document.querySelector('.modal-close').addEventListener('click', () => {
  document.querySelector('.modal').classList.toggle('active');
  document.querySelector('#modal-overlay').classList.toggle('active');
});
