import styled from "styled-components";

export const HeaderContainer = styled.header`

display: flex;
align-items: center;
justify-content: space-between;

nav {
    display: flex;
    gap: 0.5rem;
}

a {
    width: 3rem;
    height: 3rem;

    display: flex;
    justify-content: center;
    align-items: center;

    color: ${props => props.theme["gray-100"]};

    border-top: 3px solid transparent; //Para centralizar o elemento quando a borda do hover aparecer
    border-bottom: 3px solid transparent; //Para que o elemento não seja deslocado para cima na hora do hover

    &:hover {
        border-bottom: 3px solid ${props => props.theme["green-500"]};
    }

    //Vem do NavLink do react-router. Estiliza quando eu estou na página que o link me leva. Envolve todo o elemeto
    &.active {
        color: ${props => props.theme["green-500"]}
    }
}
`;