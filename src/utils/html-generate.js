export const generatePlayHtml = (data) => `
<!DOCTYPE html>
<html lang="en">
<body>
<img id="img" style="height: 100vh; width: 100%; object-fit: scale-down">
<script>
    let programs = ${JSON.stringify(data)}
    let obj = document.getElementById("img");

    let i = 0;
    let runThis = async () => {
        obj.src = programs[i % programs.length].imgUrl
        setTimeout(() => {
            i++;
            runThis()
        }, programs[i % programs.length].duration * 1000)
    }
    runThis()
</script>
</body>
</html>
`
