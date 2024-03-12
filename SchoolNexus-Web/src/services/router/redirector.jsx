import { useNavigate } from "react-router-dom";

function redirectTo(url) {
  useNavigate(url);
}

export default redirectTo