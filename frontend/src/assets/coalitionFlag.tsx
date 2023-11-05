const CoalitionFlag = (props: any) => {
    return (
        <>
       <svg xmlns="http://www.w3.org/2000/svg" className="coalition-flag--flag" style={{
         background : 'new 0 0 68 104',
         fill: `${props.color}`
        }}
        viewBox="0 0 68 104"><path d="M0 0v80.5L34.3 104 68 80.5V0z"/>
       </svg>
        </>
    );
}
export default CoalitionFlag;
