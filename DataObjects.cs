using System;
using System.Collections.Generic;

using System.Text.Json;

namespace PWA
{
    public class DataObject
    {
        public DataObject(){
            Uid = Guid.NewGuid();
        }
        
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}