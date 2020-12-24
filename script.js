const { time } = require('console');
//const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const csv=require('csvtojson')

// fs.createReadStream('./files/Science.csv')
//     .pipe(csv())
//     .on('data', (data) => {
//         results.push(data)
//     })
//     .on('end', () => {
//         console.log(results)

//     });

async function readCSV(subject){
    let result = await csv().fromFile(`./files/${subject}.csv`)
    return result
}

var getFreeTimeofTeachers;
module.exports.generateClassTimeTable =async ()=>{
    try{
        let classes =[]
        let teachersSchedule = {}
        teachersSchedule['Hindi'] = await readCSV('Hindi')
        teachersSchedule['kannada'] =await readCSV('Kannada')
        teachersSchedule['Maths'] = await readCSV('Maths')
        teachersSchedule['Science'] = await readCSV('Science')
        teachersSchedule['English'] = await readCSV('English')
        // let {HindiTeacherSchedule, EnglishTeacherSchedule, kannadaTeacherSchedule,MathsTeacherSchedule, ScienceTeacherSchedule} = require('./data')
         getFreeTimeofTeachers = freeTeacherTime(teachersSchedule)
        let TimeTable = generateClassWiseDirectTable(teachersSchedule)
        return TimeTable
    }catch(e){
        console.log("Error ",e)
    }
}  


function generateClassWiseDirectTable({Hindi, English, kannada,Maths, Science}){
    let TimeTable = []
    for (let i=6; i<=10; i++) {
        let timeTable =[]
        let classNo = i+"th"
        timeTable = fillSubjectsInTimetable(timeTable, Hindi, 'Hindi', classNo)
        timeTable = fillSubjectsInTimetable(timeTable, English, 'English', classNo)
        timeTable = fillSubjectsInTimetable(timeTable, kannada, 'Kannada', classNo)
        timeTable = fillSubjectsInTimetable(timeTable, Maths, 'Maths', classNo)
        timeTable = fillSubjectsInTimetable(timeTable, Science, 'Science', classNo)
        timeTable = getCompleteTimeTable(timeTable)
        TimeTable.push({[classNo]:timeTable})
    }
    return TimeTable
}

function fillSubjectsInTimetable(timeTable,subjectTeacherSchedule, subjectName, classNo){
    if(timeTable.length ==0) {
        timeTable = g(timeTable, subjectTeacherSchedule, subjectName, classNo);
    }else{
        timeTable = h(timeTable, subjectTeacherSchedule, subjectName, classNo)
    }
    return timeTable

}
function g(timeTable,hindi, subjectName, classNo){
    for(let i =0; i<hindi.length; i++){
        let obj = {}
        for(let key in hindi[i]){
            if(key == "--") {
                obj["--"] = hindi[i][key]
            }else if(hindi[i][key] != classNo){
                obj[key]=obj[key]|| ''
            }else{
                obj[key] = subjectName
            }
        }
        timeTable.push(obj)
    }
    return timeTable
}

function h(timeTable,subjectTeacher,subjectName,classNo){
    for (let i=0; i<timeTable.length; i++){
        for(let key in timeTable[i]){
            if(!timeTable[i][key]){
                let k =subjectTeacher[i][key]
                if(k== classNo) timeTable[i][key]= subjectName;
            }
        }
    }
    return timeTable
}

function freeTeacherTime(sheets){
    let generateSheets ={}
    for(let subjects in sheets) {
        generateSheets[subjects]={}
        for (let i = 0; i < sheets[subjects].length; i++) {
            generateSheets[subjects][sheets[subjects][i]["--"]] = []
            for(let key in sheets[subjects][i]){
                if(!sheets[subjects][i][key]){
                    generateSheets[subjects][sheets[subjects][i]["--"]].push(key)
                }
            }
        }
    }
    return generateSheets
}

function getCompleteTimeTable(timetable){
    if(!getFreeTimeofTeachers || !Object.keys(getFreeTimeofTeachers).length >0) return timetable;
    for (let i = 0; i < timetable.length; i++) {
        let time = timetable[i]["--"]
        for(let key in timetable[i]){
            if(key!= '--'){
               if(timetable[i][key] == '') timetable[i][key] = assignRandomTeacher(time, key)
            }
        }
    }
    return timetable
}

function assignRandomTeacher(time, day){
    for(let key in getFreeTimeofTeachers){
        for(let availabeTime in getFreeTimeofTeachers[key]){
            if(availabeTime == time && getFreeTimeofTeachers[key][availabeTime].indexOf(day) > -1){
                let index = getFreeTimeofTeachers[key][availabeTime].indexOf(day)
                getFreeTimeofTeachers[key][availabeTime].splice(index, 1)
                return key
            }
        }
    }
    return ''
}

