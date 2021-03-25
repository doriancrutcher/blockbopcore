import React from 'react';
import PropTypes from 'prop-types';

const ArtistTools = props => {

const dropZone={
    maxWidth:'200px',
    height:'200px',
    padding:'25px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    cursor:'pointer',
    color: '#cccccc',
    border: '4px dashed green',
    borderRadius:'10px'
}


const dropZone__input ={
    display:'none'
}

const dropZone__thumb={
    width:'100%',
    height:'100%',
    borderRadius:'10px',
    overflow:'hidden',
    backgroundColor:'#cccccc',
    backgroundSize:'cover'

}

    return (
        <div>
            <span style={dropZone}>Drop File Here or Click to Upload</span>
            <div className="dropZone__thumb" dataLabel="myfile.txt" style={{dropZone__thumb}}></div>
            <input type="file" name="myFile" className={{dropZone__input}}></input>
        </div>
    );
};

ArtistTools.propTypes = {
    
};

export default ArtistTools;
    