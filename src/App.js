import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ditto from './ditto.png';
import './App.css';

function App() {
  const [pokelist, setPokelist] = useState([]);
  const [pokedata, setPokedata] = useState([]);
  const [pokeFlavorText, setPokeFlavorText] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading]= useState(false);

  useEffect(() => {
    async function getPokesPerPage() {
      const offsetValue = page * 6;
      const response = await axios(
        'https://pokeapi.co/api/v2/pokemon/?limit=6&offset=' + offsetValue+"/"
      )
      setPokelist(response.data.results)
    }
    getPokesPerPage()

  }, [page]);

  useEffect(() => {
    async function getPokeData() {
      setLoading(true)
      if (pokelist.length > 0) {
        let apiCall = []
        for (let index = 0; index < pokelist.length; index++) {
          const poke = pokelist[index];
          apiCall[index] = axios.get(poke.url)
        }
        axios.all(apiCall).then(axios.spread((...responses) => {
          setPokedata(responses)
          getFlavorTexts(responses)
        })).catch(errors => {
          // react on errors.
        })
      }
    }
    getPokeData()
    
  }, [pokelist]);


  const getFlavorTexts = async (pokes) => {
    let pokeUrls = []
    for (let index = 0; index < pokes.length; index++) {
      const poke = pokes[index];
      pokeUrls[index] = axios.get(poke.data.species.url)
    }
    
    axios.all(pokeUrls).then(axios.spread((...flavors) => {
      setPokeFlavorText(flavors)  
      setLoading(false)
    })).catch(errors => {
      // react on errors.
    })
  }


  useEffect(() => {
    async function getFlavorText() {
      


    }
    getFlavorText()
  })

  const nextPage = () => {
    setLoading(true)
    setPage(page + 1) 
  }

  const prevPage = () => {
    setPage(page-1)
  }

  const showFlavorText = (index) => {
    let flavor;
    if(pokeFlavorText.length > 0) {
      flavor = pokeFlavorText[index].data.flavor_text_entries.find(flavor => flavor.language.name === "es")
      flavor = flavor.flavor_text
    }
    return flavor;s
  }

  const showJapanName = (index) => {
    let japanName;  
    if(pokeFlavorText.length > 0) {
      japanName = pokeFlavorText[index].data.names[0].name
      let romaji = pokeFlavorText[index].data.names[1].name
      japanName = japanName + "("+romaji+")"
    }
    return japanName;
  }

  if (pokelist.length === 0) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <div className="container">
      <div className="row">
        {pokedata.map((pokemon, i) =>

          <div key={i} className="col-md-4 card">
            <div className="pokemon card-body">
              <div className="row"> 
                <div className="poke-img col-md-4"> 
                  <img src={ loading ? ditto : pokemon.data.sprites.front_default} alt="poke"/>
                </div>
                <div className="col-md-8">
                  <div className="poke-name">{ loading ? "..." : pokemon.data.name}</div>
                  <div className="poke-japan-name">{ loading ? "..." : showJapanName(i) }</div>
                </div>
              </div>
              <div className="poke-flavor col-md-12">{ loading ? "..." : showFlavorText(i)}</div>
            </div>
          </div>
        )}
      
      <div>
      <input type="button"onClick={prevPage} disabled={page > 0 ? false : true} value='prev' />
        <input type="button"onClick={nextPage} disabled={loading} value={loading ? 'Loading...' : 'Next'} />
      </div>
    </div>
    </div>
  );
}

export default App;
