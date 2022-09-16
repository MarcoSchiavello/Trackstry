"use strict";

document.querySelectorAll('*[fakeUpload]').forEach( ele => {
    const fakeUpload = ele.getAttribute('fakeUpload');

    const input = document.querySelector(`input[type="file"][realUpload="${fakeUpload}"]`);
    
    ele.addEventListener('click', e => input.click());
    

    input.addEventListener('change', e => {
        const [file] = input.files;
        if(file) {
            console.log(file);
            const preview = document.querySelector(`img[preview="${fakeUpload}"]`);
            if(preview !== null) {
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
            }

            const fileName = document.querySelector(`*[fileName="${fakeUpload}"]`);
            if(fileName !== null)
                fileName.innerHTML = file.name;
        }
    });

});

