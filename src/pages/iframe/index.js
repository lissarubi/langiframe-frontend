import React, { useState } from 'react'
import './styles.css'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/dracula.css';

import api from '../../services/api.js'

export default function Mainpage(){

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    const [code, setCode] = useState('')
 
   async function exec(){

        if ( getParameterByName('lang') === 'javascript' ){
            try{
                const response = await api.post('/exec', { code } )
                const output = document.getElementById('output')

                if (response.data.error === false){
                    output.style.borderColor = 'black'
                    output.innerHTML = response.data.result
                }
                if (response.data.error === true){
                    output.innerHTML = response.data.result
                    output.style.borderColor = 'red'
                }

            }catch(err){
                console.log(err)
            }
        }
	
        else{
	   try{
           const output = document.getElementById('output')
	   output.innerHTML = `The server only can run Javascript, not ${ getParameterByName('lang') }`
	   }catch(err){ console.log(err) }
        }
    }

    return(
        <div className="mainpage-conteiner">
            <div className="ideBox">
                <div className="ide">
                        <CodeMirror
                        onChange={ (value) => { setCode(value.getValue()) } }
                        value={getParameterByName('code')}
                        options={{
                            theme: 'dracula',
                            keyMap: 'sublime',
                            mode: getParameterByName('lang'),
                        }
                        }
                        />
                    <div className="buttons">
				<div className="button" style={{display: "none"}} onLoad={ exec() } >Execute</div>
                    </div>
                </div>  
                </div>

                <div className="output" id="output">
                    <p style={{color: "grey"}} >Output of your code</p>
                </div>

        </div>

    )
} 
