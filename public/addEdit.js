import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  company = document.getElementById("company");
  position = document.getElementById("position");
  status = document.getElementById("status");
  addingJob = document.getElementById("adding-job");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingJob) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/jobs";

        // If updating an existing job, change method and URL
        if (addingJob.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              company: company.value,
              position: position.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // A 200 is expected for a successful update
              message.textContent = "The job entry was updated.";
            } else if (response.status === 201) {
              // A 201 is expected for a successful create
              message.textContent = "The job entry was created.";
            }

            // Reset the form fields
            company.value = "";
            position.value = "";
            status.value = "pending";
            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showJobs();
      }
    }
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    // If no jobId is passed, we're adding a new job
    company.value = "";
    position.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    // If a jobId is passed, we're editing an existing job
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        // Populate the form with the existing job data
        company.value = data.job.company;
        position.value = data.job.position;
        status.value = data.job.status;
        addingJob.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;

        setDiv(addEditDiv);
      } else {
        // If the job entry is not found, return to the job list
        message.textContent = "The job entry was not found.";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
      showJobs();
    }

    enableInput(true);
  }
};