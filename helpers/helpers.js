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
        let start = "```";
        return `${start}md
# Информация от Epic Games:
!stats    - връща вашите статовe
!stats име- връща статовете на някой
!rankme   - проверява вашето K/D и ви слага ранк
!status   - показва дали са Online server-ите за Fortnite
!pve      - още се разработва

# Други команди свързани с Fortnite Bulgaria:
!count    - показва колко хора има в сървъра и по колко са от ранк
!platform pc/xbox/ps4 -ви добавя съответната роля
!rolldice - връща случайно число между 0 и 100
!rolldice число- връща случайно число между 0 и числото
!drop     - избира ви случайно място да паднете
!challenge- дава ви предисвикателство за отбора
${start}`
    }
}
/*
stats
count
rankme
rolldice
platform
status
pve
drop
challenge
*/
module.exports = Helpers;
