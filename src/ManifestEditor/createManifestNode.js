// Creates an object to represent a node in our manifest
export function createManifestNode(){
    return {
        hidden: false, 
        children: {},
        variables: [],
        type: null
    }
}