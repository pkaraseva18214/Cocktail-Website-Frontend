export const baseUrl = "https://cocktail-recipe9589058.appspot.com";

async function getUserData(props) {
    try {
        const res = await fetch(`${baseUrl}/account`, {
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            const message = `An error has occured: ${res.status} - ${res.statusText}`;
            throw new Error(message);
        }

        const data = await res.json();
        props.handleLogin(data);

    } catch (err) {
        console.log(err.message);
    }

}

export async function setAuthtoken(props) {
    await getUserData(props);
}

