/**
 * UsersPreview component
 * 
 * See users in a set of "cards"
 * 
 */
import React, { useEffect, useState } from "react";
import { UserInfo } from "../types";
import { search } from "../utils/searchAction";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Card, CardBody, Stack } from '@chakra-ui/react';
import { formatDate } from "../utils/formatDate";
import { getRelations } from "../utils/getRelations";
import EmptyResult from "./emptyResult";

import "../styles/common.css";

interface searchConditionType{
  searchType: string;
  searchQuery: string;
  triggerFetch: number
}

const UsersPreview: React.FC<searchConditionType> = ({searchType, searchQuery, triggerFetch}) => {
  const [searchResult, setSearchResult] = useState<UserInfo[] | string | null >(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if(searchType === 'users') setSearchResult(await search<UserInfo>({searchType: 'users', inputQuery: searchQuery}));
    }
    fetchData();
  },[searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchType === 'find-followers') {
        const result = await getRelations<UserInfo[]>(searchQuery, '', searchType);
        setSearchResult(result); 
      } else if (searchType === 'find-following') {
        const result = await getRelations<UserInfo[]>(searchQuery, '', searchType);
        setSearchResult(result);  // Update the state
      }
    }
    fetchData();
    
  },[triggerFetch]);
  
  return (
    searchResult === null || searchResult === undefined ? 
      <EmptyResult />
     : typeof searchResult === 'string' ? 
      <p>Error: {searchResult}</p>  // Render error message
     : 
        // Render search results if searchResult is of type UserInfo
      
        searchResult.map((user, index) => (
          <Card key={index}
                onClick={()=>navigate(`/userdetail/${user.uid}/posts`, {state: {userinfo: user}})}
                variant='outline'>
            <img src={user.photo_url} className='pfp-in-cards'/>
            <Stack>
              <CardBody>
                <strong><h2>{user.display_name}</h2></strong>
                <p>Member since: {formatDate(user.created_at.toString())}</p>
              </CardBody>
            </Stack>
            
          </Card>
        ))
    
  );
}

export default UsersPreview;