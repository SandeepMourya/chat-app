const generateMessage = (username,text,addColour)=>{
    return{
        username,
        text,
        addColour,
        createdAt: new Date().getTime()
    }
}
const generateLocationMessage = (username,url,addColour)=>{
    return{
        username,
        url,
        addColour,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generateLocationMessage
}