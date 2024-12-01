import Auth from "./components/Auth";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useCookiesffect, useState } from "react";
import { useCookies } from "react-cookie"; // Corrigido: importação correta do hook

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["authToken", "Email"]); // Corrigido: nome do hook e chaves
  const authToken = cookies.authToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState(null); // Corrigido: ajuste no nome da variável para plural (coerência)

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todoapp_u6ex/${userEmail}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  useCookiesffect(() => {
    if (authToken) {
      getData(); 
    }
  }, [authToken, getData]); // Adiciona getData como dependência
  

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={"📋 Atividades"} getData={getData} />
          <p className="user-email">Bem vindo de volta {userEmail}</p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
