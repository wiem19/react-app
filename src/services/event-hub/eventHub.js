let fnLists = {}

const eventHub = {
    trigger(eventName, data) {
        let fnList = fnLists[eventName]
        if (!fnList) {
            return
        }
        for (let i = 0; i < fnList.length; i++) {
            fnList[i](data)
        }
    },
    on(eventName, fn) {

        if (!fnLists[eventName]) {
            fnLists[eventName] = []
        }
        fnLists[eventName].push(fn)
        console.log("fnLists", eventName)


    }
    ,
    one(eventName, fn) {
        if (!fnLists[eventName]) {
            fnLists[eventName] = []
            fnLists[eventName].push(fn)
            console.log("fnLists one", eventName)
        }


    }
}
export default eventHub;