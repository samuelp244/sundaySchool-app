

const useCurrData = () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
    const currDate = yyyy+"-"+mm+"-"+dd;
    return currDate
}

export default useCurrData