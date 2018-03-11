class Helpers {
    constructor(){
        this.emptySpace = "ᅠ";
    }

    padToLength(value, length){
        value += "";
        while (value.length < length){
            value += this.emptySpace;
        }
        return value;
    }

    roundNumb(numb){
        return numb.toFixed(1)
    }

    help(){
        return `
!stats     - връща вашите статовe
!stats some_name - връща статовете на някой
!platform pc/xbox/ps4 -ви добавя съответната роля за да се намирате
!count     - показва колко хора има в сървъра и по колко са от ранк
!rankme    - проверява вашето K/D и ви слага ранк
!rolldice  - връща случайно число между 0 и 100
!rolldice <число>- връща случайно число между 0 и числото
!status    - показва дали са Online server-ите за Fortnite
!drop      - избира ви случайно място да паднете
!challenge - дава ви предисвикателство за отбора
!pve       - още се разработва`
    }
}

module.exports = Helpers;
