const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButtom = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')



//templates
const $messagetemplate = document.querySelector('#message_template').innerHTML
const $locationTemplate = document.querySelector('#location_template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username,room} =Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoScroll =()=>{
    //new message element
    const $newMessage = $messages.lastElementChild
    
    //height of new message

    const newMessageStyles = getComputedStyle($newMessage)
    
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
 
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    

    //visible height
    const visibleHeight = $messages.offsetHeight
    

    //height of messages container
    const containerHeight = $messages.scrollHeight
    
    //how far have i scrolled

    const scrollOffset = $messages.scrollTop + visibleHeight
    
    if(Math.round(containerHeight - newMessageHeight - 1) <= Math.round(scrollOffset)){
        $messages.scrollTop = $messages.scrollHeight;
    }




}

socket.on('locationMessage', (message) => {
    const urlHtml = Mustache.render($locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a'),
        addColour:message.addColour
    })
    $messages.insertAdjacentHTML('beforeend',urlHtml)
    // console.log(url)
    autoScroll()
})



socket.on('message', (message) => {
    // console.log(message)
    const html = Mustache.render($messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a'),
        addColour:message.addColour
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users})=>{

    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButtom.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButtom.removeAttribute('disabled')
        $messageFormInput.value=""
        $messageForm.focus()
        
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocation.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})