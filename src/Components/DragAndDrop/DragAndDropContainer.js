import React,{useReducer} from 'react';
import './DND.css';
import DragAndDrop from './DragAndDrop';

const DragAndDropContainer = props => {
    const reducer = (state, action) => {
        switch (action.type) {
          case 'SET_DROP_DEPTH':
            return { ...state, dropDepth: action.dropDepth }
          case 'SET_IN_DROP_ZONE':
            return { ...state, inDropZone: action.inDropZone };
          case 'ADD_FILE_TO_LIST':
            return { ...state, fileList: state.fileList.concat(action.files) }
          default:
            return state;
        }
    
      }
    
      const [data,dispatch]=useReducer(reducer,
        {dropDepth:0,inDropZone:false,fileList:[]}
        )
    
      return (
        <div className="App">
          <h1>Drag and Drop Component</h1>
          <DragAndDrop data={data} dispatch={dispatch}/>
    
        </div>
      );
    }
    

export default DragAndDropContainer;